import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { Project, ProjectMember, Task, TaskStatus } from 'src/app/core/models/project';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/core/services/task-service/task-service';
import { TaskData } from 'src/app/core/TestData/TaskData';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { ProjectMemberLinkService } from 'src/app/core/services/project-member-link-service/project-member-link-service';

@Component({
  selector: 'app-project-information-dialog',
  standalone: true, 
  imports: [CommonModule, SharedModule, ButtonModule, TableModule],
  templateUrl: './project-information-dialog.component.html',
  styleUrls: ['./project-information-dialog.component.css'],
})
export class ProjectInformationDialogComponent implements OnInit {
  project!: Project;
  projectDescription = '';
  allTasks: Task[] = [];  
  projectTasks: Task[] = [];  
  selectedTask?: Task;
  members: ProjectMember[] = [];
  users: ProjectMember[] = [];
  allMemberLinks: { projectId: number; memberId: number }[] = []; 
  projectMemberLinks: { projectId: number; memberId: number }[] = []; 



  constructor(
    private router: Router, 
    private taskService: TaskService, 
    private projectMemberService: ProjectMemberService,
    private projectMemberLinkService: ProjectMemberLinkService) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation?.extras.state && navigation.extras.state['selectedProject']) {
      this.project = navigation.extras.state['selectedProject'];
      console.log('✅ Project received from state:', this.project);
    } else {
      const storedProject = sessionStorage.getItem('selectedProject');
      this.project = storedProject ? JSON.parse(storedProject) : null;
      
      if (this.project) {
        console.log('✅ Project loaded from sessionStorage:', this.project);
      } else {
        console.error('❌ No project found!');
        return;
      }
    }

    if (this.project?.description) {
      this.projectDescription = this.project.description;
    }

    this.loadAllTasks();
    this.GetAllMembers();
    this.GetProjectMemberLinks();
  }

  openChart(){
    sessionStorage.setItem('selectedProject', JSON.stringify(this.project));
    sessionStorage.setItem('ProjectRelatedTasks', JSON.stringify(this.allTasks))
    this.router.navigate(['/ShowChartDialog'], { state: { project: this.project, allTasks: this.allTasks } });
  }

  GetAllMembers() {
    this.projectMemberService.getAll().subscribe({
      next: (members) => {
        this.users = members;
        console.log('All members loaded:', this.users);
      },
      error: (err) => {
        console.error('Error fetching members:', err);
      }
    });
  }

  GetProjectMemberLinks() {
    this.projectMemberLinkService.getAll().subscribe({
      next: (links) => {
        this.allMemberLinks = links; 
        console.log('All project-member links fetched:', this.allMemberLinks);

        if (this.project && this.project.id) {
          this.ConnectUsersToProject(); 
          const memberIDs = this.projectMemberLinks.map(link => link.memberId);
          console.log('Member IDS: ', memberIDs)
          this.members = this.users.filter(user => memberIDs.includes(Number(user.id)))
        }
      },
      error: (err) => {
        console.error('Error fetching project-member links:', err);
      }
    });
  }

  ConnectUsersToProject() {
    this.projectMemberLinks = this.allMemberLinks.filter(link => link.projectId === this.project.id);
    console.log('Current Project:', this.project);
    console.log('Connected Project Member Links:', this.projectMemberLinks);
  
  }
  
  addTask(task?: Task) {
    if (!task) {
      console.warn('⚠️ Kein Task übergeben! Erstelle neuen Task...');
      task = {
        id: this.generateRandomId(),  
        projectId: this.project ? this.project.id : 0,
        title: '',
        description: '',
        assignedTo: null,
        dueDate: null,
        status: TaskStatus.NotStarted
      };
    }
  
    this.selectedTask = task;
  
    sessionStorage.setItem('selectedTask', JSON.stringify(task));
    sessionStorage.setItem('selectedProject', JSON.stringify(this.project));
  
    console.log("✅ Add Task To local Cache:", JSON.stringify(task, null, 2));
    console.log("✅ Navigating with state:", { project: this.project, task: task });
  
    this.router.navigate(['/AddOrUpdateTask'], { state: { project: this.project, task: task } });
  }

  AddUserToProject (){
    sessionStorage.setItem('selectedProject', JSON.stringify(this.project));
    this.router.navigate(['/AddUserToProject'], { state: { project: this.project} });
  }
  


  loadAllTasks(): void {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.allTasks = tasks && tasks.length > 0 ? tasks : TaskData.getTasks();
        console.log('✅ All tasks loaded:', this.allTasks);
        
        this.filterTasksByProjectId();
      },
      error: (err) => {
        console.error('❌ Error fetching all tasks:', err);
        //this.allTasks = TaskData.getTasks();
        //this.filterTasksByProjectId();
      },
    });
  }
  
  

  filterTasksByProjectId(): void {
    try {
      console.log('🔄 Filtering tasks for project:', this.project);
  
      if (!this.project?.id) {
        console.error('❌ Error: No project ID found!');
        return;
      }
  
      this.projectTasks = this.allTasks.filter(task => task.projectId == this.project?.id)

      if (this.projectTasks.length === 0) {
        console.warn(`⚠️ Warning: No tasks found for project ID ${this.project.id}`);
      }
  
      console.log(`✅ Filtered ${this.projectTasks.length} tasks for project ${this.project.id}:`, this.projectTasks);
      
    } catch (error) {
      console.error('❌ Error in filterTasksByProjectId:', error);
    }
  }
  

  closeDialog() {
    this.router.navigate(['/Projects']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/Projects']);
  }

    

  getAssignedTo(task: Task): string {
    console.log(`✅ Assigned to (raw value):`, task.assignedTo);
  
    if (!task.assignedTo) {
      return 'Unassigned';
    }
  
    // Falls assignedTo eine ID (number) ist, suche den passenden Member
    if (typeof task.assignedTo === 'number') {
      const member = this.members.find(m => m.id === task.assignedTo);
      if (member) {
        return member.name;
      } else {
        console.warn(`⚠️ Kein Mitglied mit ID ${task.assignedTo} gefunden!`);
        return `User ID: ${task.assignedTo}`;
      }
    }
  
    return 'Unknown';
  }
  

  getTaskStatus(task: Task){
    if(!task.status) {
      return "no Status";
    }
    return task.status; 

  }

  generateRandomId(): number {
    return (Math.floor(1000 + Math.random() * 9000));
  }
  
  
}

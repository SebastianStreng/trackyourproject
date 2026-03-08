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
import { ProjectService } from 'src/app/core/services/project-service/project-service';

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
  dataReady = false;
  memberLenght!: number

  
  
  constructor(
    private router: Router, 
    private taskService: TaskService, 
    private projectMemberService: ProjectMemberService,
    private projectMemberLinkService: ProjectMemberLinkService,
    private projectService: ProjectService) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation?.extras.state && (navigation.extras.state['selectedProject'] || navigation.extras.state['project'])) {
      this.project = navigation.extras.state['selectedProject'] || navigation.extras.state['project'];
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


    this.loadMembersAndLinks(); 

  }

  loadMembersAndLinks() {
    this.projectMemberService.getAll().subscribe({
      next: (users) => {
        this.users = users;
  
        this.projectMemberLinkService.getAll().subscribe({
          next: (links) => {
            this.allMemberLinks = links;
  
            if (this.project && this.project.id) {
              this.projectMemberLinks = this.allMemberLinks.filter(link => link.projectId === this.project.id);
              const memberIDs = this.projectMemberLinks.map(link => link.memberId);
              this.members = this.users.filter(user => memberIDs.includes(Number(user.id)));
              this.updateMemberMap();
  
              this.loadAllTasks();
            }
          },
          error: (err) => console.error('Error loading member links:', err)
        });
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }
  

  openChart(){
    sessionStorage.setItem('selectedProject', JSON.stringify(this.project));
    sessionStorage.setItem('ProjectRelatedTasks', JSON.stringify(this.projectTasks))
    this.router.navigate(['/ShowChartDialog'], { state: { project: this.project, allTasks: this.projectTasks } });
  }

  GetAllMembers() {
    this.projectMemberService.getAll().subscribe({
      next: (members) => {
        this.users = members;
        console.log('All members loaded:', this.users);
  
        this.GetProjectMemberLinks();  
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
          console.log('members in this project: ', this.members)
  
          this.dataReady = true;  
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
    sessionStorage.setItem('selectedProject', JSON.stringify(this.project));

    if (task) {
      this.selectedTask = task;
      sessionStorage.setItem('selectedTask', JSON.stringify(task));
      this.router.navigate(['/AddOrUpdateTask'], { state: { project: this.project, task: task } });
    } else {
      sessionStorage.removeItem('selectedTask');
      this.router.navigate(['/AddOrUpdateTask'], { state: { project: this.project } });
    }
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
        this.dataReady = true; 
        this.memberLenght = this.members.length   
      },
      error: (err) => {
        console.error('❌ Error fetching all tasks:', err);
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
  
      this.projectTasks = this.allTasks.filter(task => Number(task.projectId) === Number(this.project?.id))

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
    this.router.navigate(['/Selection']);
  }

  goBack() {
    this.router.navigate(['/Projects']);
  }

    

  memberMap = new Map<number, ProjectMember>();

  updateMemberMap() {
    console.log('🛠️ Building memberMap...');
    this.memberMap.clear();
    this.members.forEach(m => {
      const id = Number(m.id); // ensure it's a number
      console.log(`➕ Adding to map: ${id} → ${m.name}`);
      this.memberMap.set(id, m); // ✅ use numeric key
    });
  }
  
  
  getAssignedTo(task: Task): string {
    console.log('🔍 Checking assignedTo for task:', task.title, '| assignedTo:', task.assignedTo);
  
    if (!task.assignedTo) {
      console.log('ℹ️ Task has no assigned user.');
      return 'Unassigned';
    }
  
    console.log('📦 Current memberMap keys:', Array.from(this.memberMap.keys()));
  
    const memberId = Number(task.assignedTo);
    const member = this.memberMap.get(memberId);
  
    if (member) {
      console.log(`✅ Found member for ID ${memberId}:`, member.name);
      return member.name;
    } else {
      console.warn(`⚠️ No member found in memberMap for ID ${memberId}`);
      return `User ID: ${task.assignedTo}`;
    }
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

  deleteProject(){
      if (!this.project || !this.project.id) {
        console.warn("⚠️ No project selected for deletion.");
        return;
      }
    
      if (!confirm(`Are you sure you want to delete the project: "${this.project.name}"?`)) {
        return;
      }
      
      this.deleteProjectRelatedTasks();
      this.deleteProjectAssignedUsers(); 
  
      this.projectService.delete(this.project.id).subscribe({
        next: () => {
          console.log(`✅ Project ${this.project.id} deleted successfully.`);
          this.router.navigate(['/Projects']); // Redirect to project list after deletion
        },
        error: (err) => {
          console.error(`❌ Error deleting project ${this.project.id}:`, err);
        }
      });
    }
    
  deleteProjectRelatedTasks() {
    if (!this.projectTasks || this.projectTasks.length === 0) {
      console.warn("⚠️ No tasks found to delete for this project.");
      return;
    }
  
    let deletedTasksCount = 0;
  
    this.projectTasks.forEach((task) => {
      this.taskService.delete(task.id).subscribe({
        next: () => {
          console.log(`✅ Task ${task.id} deleted successfully.`);
          deletedTasksCount++;
  
          if (deletedTasksCount === this.projectTasks.length) {
            console.log("✅ All tasks deleted, refreshing task list...");
            this.loadAllTasks();  
          }
        },
        error: (err) => {
          console.error(`❌ Error deleting task ${task.id}:`, err);
        }
      });
    });
  }
  

  deleteProjectAssignedUsers() {
    if (!this.projectMemberLinks || this.projectMemberLinks.length === 0) {
      console.warn("⚠️ No assigned users found for this project.");
      return;
    }

    let deletedUsersCount = 0;
  
    this.projectMemberLinks.forEach((link) => {
      this.projectMemberLinkService.delete(this.project.id, link.memberId).subscribe({
        next: () => {
          console.log(`✅ Removed member ${link.memberId} from project ${this.project.id}`);
          deletedUsersCount++;
  
          if (deletedUsersCount === this.projectMemberLinks.length) {
            console.log("✅ All assigned users removed, refreshing member list...");
            this.GetProjectMemberLinks();
          }
        },
        error: (err) => {
          console.error(`❌ Error removing member ${link.memberId}:`, err);
        }
      });
    });
  }
  
  
}

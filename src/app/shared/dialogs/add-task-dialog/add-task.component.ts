import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared.module";
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { Project, ProjectMember, TaskStatus } from 'src/app/core/models/project';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/core/services/task-service/task-service';
import { SelectModule } from 'primeng/select';
import { Task } from 'src/app/core/models/project';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { ProjectMemberLinkService } from 'src/app/core/services/project-member-link-service/project-member-link-service';

@Component({
  selector: 'app-add-task',
  imports: [CommonModule, SharedModule, DialogCardComponent, SelectModule, InputTextModule, TextareaModule, DatePickerModule],
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent implements OnInit {

  project!: Project; 
  task: Task | null = null;
  title? : string;
  assignedTo!: number; 
  members: ProjectMember[] = [];
  description = '';
  dueDate= '';
  status = TaskStatus;
  selectedStatus: TaskStatus | null = null;
  alreadyExists = false; 
  users: ProjectMember [] = []
  allMemberLinks: { projectId: number; memberId: number }[] = []; 
  projectMemberLinks: { projectId: number; memberId: number }[] = []; 

  statusOptions = [
    { label: 'Not Started', value: TaskStatus.NotStarted },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Completed', value: TaskStatus.Completed },
    { label: 'Blocked', value: TaskStatus.Blocked }
  ];
  
  constructor(
    private router: Router, 
    private taskService: TaskService, 
    private projectMemberService: ProjectMemberService,
    private projectMemberLinkService: ProjectMemberLinkService) {}
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
  
    console.log("✅ Navigation Object:", navigation);
  
    if (navigation?.extras.state) {
      console.log("✅ Navigation State:", navigation.extras.state);
  
      if (navigation.extras.state['task']) {
        this.task = navigation.extras.state['task'];
        this.alreadyExists = true;
        sessionStorage.setItem('selectedTask', JSON.stringify(this.task));  
      }
      
      if (navigation.extras.state['project']) {
        this.project = navigation.extras.state['project'];
        sessionStorage.setItem('selectedProject', JSON.stringify(this.project)); 
      }
    } else {
      console.warn('⚠️ No navigation state found! Loading from sessionStorage...');
  
      const storedTask = sessionStorage.getItem('selectedTask');
      this.task = storedTask ? JSON.parse(storedTask) : null;
  
      const storedProject = sessionStorage.getItem('selectedProject');
      this.project = storedProject ? JSON.parse(storedProject) : null;
    }
  

    this.title = this.task?.title ?? '';  
    this.description = this.task?.description ?? '';
    this.assignedTo = this.task?.assignedTo ?? 0;  
    this.dueDate = this.task?.dueDate ? new Date(this.task.dueDate).toISOString().substring(0, 10) : '';
    this.selectedStatus = this.task?.status ?? TaskStatus.NotStarted;
  
    console.log("✅ Final Task state in ngOnInit:", this.task);

    this.GetAllMembers();
    this.GetProjectMemberLinks(); 
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

  ConnectUsersToProject() {
    this.projectMemberLinks = this.allMemberLinks.filter(link => link.projectId === this.project.id);
    console.log('Current Project:', this.project);
    console.log('Connected Project Member Links:', this.projectMemberLinks);
  
  }
  
  
  AddOrUpdateTask() {
    const taskData: Task = {
      id: this.task ? this.task.id : 0,
      projectId: this.project?.id ?? '',  // Ensure it's not 0
      title: this.title ?? '',  
      description: this.description ?? '',
      assignedTo: this.assignedTo ?? 0,  // IS not a number !!! needs to
      dueDate: this.dueDate ? new Date(this.dueDate) : null,
      status: this.selectedStatus ?? TaskStatus.NotStarted,
    };
    
  
  
    if (this.alreadyExists) {
      this.taskService.updateTask(taskData).subscribe({
        next: (updatedTask) => {
          console.log('Task updated:', updatedTask);
          this.router.navigate(['/ProjectInformation'], { state: { project: this.project } });
        },
        error: (err) => console.error('Error updating task:', err),
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: (createdTask) => {
          console.log('Task created:', createdTask);
          this.router.navigate(['/ProjectInformation'], { state: { project: this.project } });
        },
        error: (err) => console.error('Error creating task:', err),
      });
    }
  }
  
  closeDialog() {
    this.router.navigate(['/ProjectInformation'], { state: { project: this.project } });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
        this.router.navigate(['/ProjectInformation'], { state: { project: this.project } });
  }

  deleteTask() {
    if (!this.task || !this.task.id) {
      console.warn("⚠️ No task selected for deletion.");
      return;
    }
  
    if (!confirm(`Are you sure you want to delete the task: "${this.task.title}"?`)) {
      return;
    }
  
    this.taskService.delete(this.task.id).subscribe({
      next: () => {
        console.log(`✅ Task ${this.task?.id} deleted successfully`);
        this.router.navigate(['/ProjectInformation'], { state: { project: this.project } });
      },
      error: (err) => {
        console.error(`❌ Error deleting task ${this.task?.id}:`, err);
      },
    });
  }
  
}


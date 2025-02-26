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

@Component({
  selector: 'app-add-task',
  imports: [CommonModule, SharedModule, DialogCardComponent, SelectModule, InputTextModule, TextareaModule, DatePickerModule],
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent implements OnInit {

  project: Project | null = null;
  task: Task | null = null;
  title? : string;
  assignedTo: string | ProjectMember | null = null;
  members: ProjectMember[] = [];
  description = '';
  dueDate= '';
  status = TaskStatus;
  selectedStatus: TaskStatus | null = null;
  alreadyExists = false; 

  statusOptions = [
    { label: 'Not Started', value: TaskStatus.NotStarted },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Completed', value: TaskStatus.Completed },
    { label: 'Blocked', value: TaskStatus.Blocked }
  ];
  
  constructor(private router: Router, private taskService: TaskService) {}
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
    this.assignedTo = this.task?.assignedTo ?? null;
    this.dueDate = this.task?.dueDate ? new Date(this.task.dueDate).toISOString().substring(0, 10) : '';
    this.selectedStatus = this.task?.status ?? TaskStatus.NotStarted;
  
    console.log("✅ Final Task state in ngOnInit:", this.task);
  }
  
  
  
  
  AddOrUpdateTask() {
    const taskData: Task = {
      id: this.task ? this.task.id : 0,
      projectId: this.project ? this.project.id : 0, 
      title: this.title ?? '',  
      description: this.description ?? '',
      assignedTo: this.assignedTo ?? null,
      dueDate: this.dueDate ? new Date(this.dueDate) : null,
      status: this.selectedStatus ?? TaskStatus.NotStarted,
    };
  
  
    if (this.alreadyExists) {
      this.taskService.update(taskData).subscribe({
        next: (updatedTask) => {
          console.log('Task updated:', updatedTask);
          this.router.navigate(['/ProjectInformation'], { state: { project: this.project } });
        },
        error: (err) => console.error('Error updating task:', err),
      });
    } else {
      this.taskService.create(taskData).subscribe({
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
    this.router.navigate(['/Projects']);
  }
}


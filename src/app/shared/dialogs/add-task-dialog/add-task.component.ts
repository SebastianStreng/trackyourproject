import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared.module";
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { Project, ProjectMember, TaskStatus } from 'src/app/core/models/project';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/core/services/task-service/task-service';
import { IftaLabelModule } from 'primeng/iftalabel';
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
  title = '';
  assignedTo: ProjectMember | null = null;; 
  members: ProjectMember [] = []; 
  description = '';
  date = ''
  status = TaskStatus;
  selectedStatus: TaskStatus | null = null;

  statusOptions = [
    { label: 'Not Started', value: TaskStatus.NotStarted },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Completed', value: TaskStatus.Completed },
    { label: 'Blocked', value: TaskStatus.Blocked }
  ];
  
  constructor(private router: Router, private taskService: TaskService) {}
  ngOnInit(): void {


  }


  AddOrUpdateTask(){

  }

  closeDialog() {
    this.router.navigate(['/ProjectInformation'], { state: { project: this.project} });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/Projects']);
  }
}

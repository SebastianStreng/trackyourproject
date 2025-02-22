import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared.module";
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { Project, ProjectMember } from 'src/app/core/models/project';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/core/services/task-service/task-service';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { Task } from 'zone.js/lib/zone-impl';
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
export class AddTaskComponent {

  project: Project | null = null;
  task: Task | null = null;
  title = '';
  assignedTo: ProjectMember | null = null;; 
  members: ProjectMember [] = []; 
  description = '';
  date = ''


  constructor(private router: Router, private taskService: TaskService) {}


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

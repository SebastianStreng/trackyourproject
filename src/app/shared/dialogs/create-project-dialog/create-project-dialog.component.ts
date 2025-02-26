import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { SharedModule } from "../../shared.module";
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectMember, Task } from 'src/app/core/models/project';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true, 
  imports: [CommonModule, SharedModule, DialogCardComponent, InputTextModule],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.css',
})
export class CreateProjectDialogComponent {

  id?: number; 
  name?: string; 
  description?: string; 
  startDate?: Date; 
  endDate?: Date; 
  members?: ProjectMember[]; 
  tasks?: Task[]; 


  constructor(private router: Router){

  }

  closeDialog() {
    this.router.navigate(['/']);
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { SharedModule } from "../../shared.module";
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { ProjectMember, Task } from 'src/app/core/models/project';
import { FormsModule } from '@angular/forms'; 
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';


@Component({
  selector: 'app-create-project-dialog',
  standalone: true, 
  imports: [
    CommonModule,
    SharedModule, 
    DialogCardComponent, 
    InputTextModule, 
    FormsModule, 
    TableModule, 
    CheckboxModule,
    TextareaModule,
    DatePickerModule
  ],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.css',
})
export class CreateProjectDialogComponent implements OnInit { 
  id?: number; 
  name?: string; 
  description?: string; 
  startDate?: Date; 
  endDate?: Date; 
  members: ProjectMember[] = []; 
  tasks?: Task[];  
  selectedMembers: ProjectMember[] = []; 

  constructor(private router: Router, private projectMemberService: ProjectMemberService) {} 

  ngOnInit(): void {
    this.loadProjectMembers(); 
  }

  loadProjectMembers(): void {
    this.projectMemberService.getAll().subscribe({
      next: (members) => {
        this.members = members;
        console.log("✅ Project Members geladen:", this.members);
      },
      error: (err) => {
        console.error("❌ Fehler beim Laden der Project Members:", err);
      }
    });
  }

  goHome() {

  }

  goBack () {

  }

  delete(){

  }

  createNew(){
    
  }

  closeDialog() {
    this.router.navigate(['/']);
  }
}



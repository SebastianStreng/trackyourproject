import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { SharedModule } from "../../shared.module";
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { Project, ProjectMember, Task } from 'src/app/core/models/project';
import { FormsModule } from '@angular/forms'; 
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ProjectService } from 'src/app/core/services/project-service/project-service';
import { ProjectMemberLinkService } from 'src/app/core/services/project-member-link-service/project-member-link-service';
import { MemberData } from 'src/app/core/TestData/MemberData';

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

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private projectMemberService: ProjectMemberService,
    private projectMemberLinkService: ProjectMemberLinkService
  ) {} 

  ngOnInit(): void {
    this.loadProjectMembers(); 
    this.id = this.generateRandomId(); 
  }

  loadProjectMembers(): void {
    this.projectMemberService.getAll().subscribe({
      next: (members) => {
        this.members = members && members.length > 0 ? members : MemberData.getMembers();
        console.log("✅ Project members loaded:", this.members);
      },
      error: (err) => {
        console.error("❌ Error loading project members:", err);
        //this.members = MemberData.getMembers();
      }
    });
  }

  goHome() {
    this.router.navigate(['/Selection']);
  }

  goBack () {
    this.router.navigate(['/Selection']);
  }

  delete(){
    console.log("🚮 Delete action (not yet implemented)");
  }

  createNew(){
    this.startDate = new Date();

    if (!this.name || !this.startDate) {
      console.error("❌ Name and start date are required!");
      return;
    }

    // Collect checked members from checkbox binding
    this.selectedMembers = this.members.filter((m: any) => m.selected);

    const project: Project = {
      id: this.id ?? this.generateRandomId(),
      name: this.name,
      description: this.description ?? '',
      startDate: this.startDate!,
      endDate: this.endDate ?? undefined,
      members: this.selectedMembers,
      tasks: []
    };

    console.log("📤 Sending new project:", project);

    this.projectService.create(project).subscribe({
      next: (response: any) => {
        const newProjectId = response.id;
        console.log("✅ Project successfully created with ID:", newProjectId);

        if (this.selectedMembers.length > 0 && newProjectId) {
          const memberIds = this.selectedMembers.map(m => m.id);
          this.projectMemberLinkService.update(newProjectId, memberIds).subscribe({
            next: () => {
              console.log("✅ Members linked to project");
              this.router.navigate(['/Selection']);
            },
            error: (err) => {
              console.error("❌ Error linking members:", err);
              this.router.navigate(['/Selection']);
            }
          });
        } else {
          this.router.navigate(['/Selection']);
        }
      },
      error: (err) => {
        console.error("❌ Error creating project:", err);
      }
    });
  }

  generateRandomId(): number {
    return (Math.floor(1000 + Math.random() * 9000));
  }

  closeDialog() {
    this.router.navigate(['/Selection']);
  }
}

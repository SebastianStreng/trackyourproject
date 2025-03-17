import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { ProjectMemberLinkService } from 'src/app/core/services/project-member-link-service/project-member-link-service';
import { Project, ProjectMember } from 'src/app/core/models/project';
import { Router } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared.module';
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";

@Component({
  selector: 'app-assign-user-to-project',
  imports: [CommonModule, SharedModule, DialogCardComponent, TableModule, CheckboxModule],
  templateUrl: './assign-user-to-project.component.html',
  styleUrl: './assign-user-to-project.component.css',
})
export class AssignUserToProjectComponent implements OnInit {
  users: ProjectMember[] = []; 
  selectedUsers: ProjectMember[] = []; 

  allMemberLinks: { projectId: number; memberId: number }[] = []; 
  projectMemberLinks: { projectId: number; memberId: number }[] = []; 

  project!: Project; 

  constructor(
    private router: Router,
    private projectMemberService: ProjectMemberService,
    private projectMemberLinkService: ProjectMemberLinkService
  ) {}

  ngOnInit(): void {
    const navigation = history.state;
    
    if (navigation.project) {
      this.project = navigation.project;
    } else {
      const storedProject = sessionStorage.getItem('selectedProject');
      this.project = storedProject ? JSON.parse(storedProject) : null;
    }

    this.GetAllMembers();
    this.GetProjectMemberLinks(); 
  }

  updateUsers() {
    if (!this.project || !this.project.id) {
      console.error('❌ No Project found!');
      return;
    }
  
    const memberIds = this.selectedUsers.map(user => user.id);
  
    console.log(`🔄 new Users: ${this.project.id}:`, memberIds);
  
    this.projectMemberLinkService.update(this.project.id, memberIds).subscribe({
      next: (response) => {
        console.log('✅ Add Users succefully:', response);
      },
      error: (err) => {
        console.error('❌ ERROR - could not update users :', err);
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
  
    const linkedMemberIds = this.projectMemberLinks.map(link => link.memberId);
    this.selectedUsers = this.users.filter(user => linkedMemberIds.includes(Number(user.id)));
  
    console.log(`Selected Users for Project ${this.project.id}:`, this.selectedUsers);
  }
  


  isSelected(user: ProjectMember): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }


  toggleUserSelection(user: ProjectMember, checked: boolean) {
    if (checked) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    }
    console.log('Currently selected users:', this.selectedUsers);
  }

  goHome() {
    this.router.navigate(['Selection']);
  }

  goBack() {
    this.router.navigate(['/ProjectInformation'], { state: { project: this.project } });
  }

  closeDialog() {
    this.router.navigate(['/ProjectInformation'], { state: { project: this.project } });
  }
}

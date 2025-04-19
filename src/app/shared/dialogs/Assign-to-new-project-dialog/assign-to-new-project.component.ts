import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared.module";
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { TableModule } from 'primeng/table';
import { Project } from 'src/app/core/models/project';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project-service/project-service';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { ProjectMemberLinkService } from 'src/app/core/services/project-member-link-service/project-member-link-service';

@Component({
  imports: [CommonModule, SharedModule, DialogCardComponent, TableModule, CheckboxModule],
  templateUrl: './assign-to-new-project.component.html',
  styleUrl: './assign-to-new-project.component.css',
})
export class AssignToNewProjectComponent implements OnInit {
  projects: Project[] = [];
  selectedProjects: Project[] = [];
  currentUser: any = null;
  allMemberLinks: { projectId: number; memberId: number }[] = []; 
  projectMemberLinks: { projectId: number; memberId: number }[] = []; 
  memberIdArray: number [] = []; 

  constructor(
    private router: Router, 
    private projectService: ProjectService, 
    private authService: AuthenticationService,
    private projectMemberService: ProjectMemberService,
    private projectMemberLinkService: ProjectMemberLinkService
  ) {} 

  ngOnInit(): void {
    this.authService.getCurrentProjectMember().subscribe(user => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
      this.loadProjects();
    });

    this.GetProjectMemberLinks(); 
  }

  private loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (projects: any[]) => {
        this.projects = projects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          startDate: new Date(p.startDate),
          endDate: p.endDate ? new Date(p.endDate) : undefined,
          members: p.members || [],
          tasks: p.tasks || []
        }));
        console.log('Projects successfully loaded:', this.projects);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.projects = [];
      }
    });
  }

  update() {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('❌ No current user found. Cannot update project-member links.');
      return;
    }
  
    const projectIds = this.selectedProjects.map(project => project.id);
  
    if (projectIds.length === 0) {
      console.warn(`⚠️ No projects selected. Removing all project-member links for user ${this.currentUser.id}.`);
    }
  
    console.log(`🔄 Updating project-member links for user ${this.currentUser.id} with projects:`, projectIds);
  
    this.createOrUpdate(this.currentUser.id, projectIds);
  }
  
  createOrUpdate(memberId: number, projectIds: number[]) {
    this.projectMemberLinkService.getAll().subscribe({
      next: (existingLinks) => {
        console.log('🔍 Checking existing project-member links:', existingLinks);
  
        const currentUserLinks = existingLinks.filter(link => link.memberId === memberId);
        const existingProjectIds = currentUserLinks.map(link => link.projectId);
  
        const newProjects = projectIds.filter(projectId => !existingProjectIds.includes(projectId));
        const removedProjects = existingProjectIds.filter(projectId => !projectIds.includes(projectId));
  
        console.log('➕ Projects to add:', newProjects);
        console.log('➖ Projects to remove:', removedProjects);
  
        newProjects.forEach(projectId => {
          this.projectMemberLinkService.create(projectId, memberId ).subscribe({
            next: (response) => console.log(`✅ Added user ${memberId} to project ${projectId}:`, response),
            error: (err) => console.error(`❌ Error adding user ${memberId} to project ${projectId}:`, err),
          });
        });
  
        if (removedProjects.length > 0) {
          this.memberIdArray = [memberId]; 
          for (const projectId of removedProjects) {
            this.projectMemberLinkService.delete(projectId, memberId).subscribe({
              next: (response) => console.log(`✅ Removed user ${memberId} from project ${projectId}:`, response),
              error: (err) => console.error(`❌ Error removing user ${memberId} from project ${projectId}:`, err),
            });
          }
        }
        
      },
      error: (err) => console.error('❌ Error fetching existing project-member links:', err),
    });
  }
  

  GetProjectMemberLinks() {
    this.projectMemberLinkService.getAll().subscribe({
      next: (links) => {
        this.allMemberLinks = links; 
        console.log('All project-member links fetched:', this.allMemberLinks);
        this.getProjectsOfCurrentUser();
      },
      error: (err) => {
        console.error('Error fetching project-member links:', err);
      }
    });
  }

  private getProjectsOfCurrentUser(): void {
    if (!this.currentUser || !this.currentUser.id) {
      console.warn('No user found, skipping project selection.');
      return;
    }

    const userProjectIds = this.allMemberLinks
      .filter(link => link.memberId === this.currentUser.id)
      .map(link => link.projectId);

    this.selectedProjects = this.projects.filter(project => userProjectIds.includes(project.id));

    console.log(`Selected projects for user ${this.currentUser.id}:`, this.selectedProjects);
  }

  isSelected(project: Project): boolean {
    return this.selectedProjects.some(p => p.id === project.id);
  }

  toggleProjectSelection(project: Project, checked: boolean) {
    if (checked) {
      this.selectedProjects.push(project);
    } else {
      this.selectedProjects = this.selectedProjects.filter(p => p.id !== project.id);
    }
    console.log('Selected projects:', this.selectedProjects);
  }

  goHome() {
    this.router.navigate(['Selection']);
  }

  goBack() {
    this.router.navigate(['Selection']);
  }

  closeDialog() {
    this.router.navigate(['Selection']);
  }
}

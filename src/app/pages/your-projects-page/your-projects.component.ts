import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from 'src/app/core/services/project-service/project-service';
import { Project } from 'src/app/core/models/project';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';

@Component({
  selector: 'app-your-project-page',
  imports: [CommonModule, SmartphoneCardComponent, TableModule, ButtonModule],
  templateUrl: './your-projects.component.html',
  styleUrls: ['./your-projects.component.css'], 
})
export class YourProjectsComponent implements OnInit {

  projects: Project[] = []; 
  currentUserProjects: Project[] = [];

  constructor(private router: Router, private projectService: ProjectService, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.fetchCurrentUserProjects();
  }

  fetchProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data: any[]) => {
        this.projects = data.map(project => ({
          ...project,
          startDate: new Date(project.start_date),
          endDate: project.end_date ? new Date(project.end_date) : null,
          members: project.members || [],
          tasks: project.tasks || []
        }));
        console.log('Projects loaded:', this.projects);
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }

  fetchCurrentUserProjects(): void {
    const currentUser = this.authService.getCurrentProjectMember();
    if (!currentUser || !currentUser.id) return;
    
    this.currentUserProjects = this.projects.filter(project =>
      project.members.some(member => member.id === currentUser.id)
    );
    console.log('Current user projects:', this.currentUserProjects);
  }

  getProjectMembers(projectId: number): string {
    const project = this.projects.find(p => p.id === projectId);
    return project?.members.map(member => member.name).join(', ') || 'No members';
  }

  getProjectTasks(projectId: number): string {
    const project = this.projects.find(p => p.id === projectId);
    return project?.tasks.map(task => task.title).join(', ') || 'No tasks';
  }

  onProjectClick(project: Project): void {
    console.log('Project clicked:', project);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['..']);
  }
}

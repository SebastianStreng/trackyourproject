import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Project } from 'src/app/core/models/project';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';
import { ProjectService } from 'src/app/core/services/project-service/project-service';
import { ProjectMemberLinkService } from 'src/app/core/services/project-member-link-service/project-member-link-service';

@Component({
  selector: 'app-your-project-page',
  standalone: true,
  imports: [CommonModule, SmartphoneCardComponent, TableModule, ButtonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  currentUser: any = null; // 👤 Hier wird der eingeloggte User gespeichert
  allMemberLinks: { projectId: number; memberId: number }[] = []; 
  projectMemberLinks: { projectId: number; memberId: number }[] = []; 

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthenticationService, 
    private projectService: ProjectService, 
    private projectMemberLinkService: ProjectMemberLinkService
  ) {}

  ngOnInit(): void {
    // 🔥 Lade den eingeloggten Benutzer
    this.authService.getCurrentProjectMember().subscribe(user => {
      this.currentUser = user;
      console.log('Current User:', this.currentUser);
    });

    this.route.queryParams.subscribe(params => {
      const filter = params['filter'];

      if (filter === 'mine') {
        this.loadUserProjects();
      } else {
        this.loadAllProjects();
      }
    });

  }

  loadUserProjects() {
    if (!this.currentUser) {
      return;
    }
  
    this.projectService.getAll().subscribe((allProjects: any[]) => { // Use 'any[]' if the API response is inconsistent
      this.projectMemberLinkService.getAll().subscribe((links) => {
        this.allMemberLinks = links;
        this.projectMemberLinks = this.allMemberLinks.filter(ml => ml.memberId === this.currentUser.id);
        this.projects = allProjects
          .filter((project: any) => this.projectMemberLinks.some(link => link.projectId === project.id))
          .map((project: any) => ({
            ...project,
            members: project.members || [], // Ensure members exist
            tasks: project.tasks || [] // Ensure tasks exist
          }));
      }, error => {
        console.error('Error fetching project-member links:', error);
      });
    }, error => {
      console.error('Error fetching projects:', error);
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
  }

  loadAllProjects() {
    this.projectService.getAll().subscribe((projects: any[]) => {
      this.projects = projects;
    });
  }


  AssignToNewProject() {
    this.router.navigate(['/AssignToNewProject'], { state: { projects: this.projects } });
  }

  show(project: Project) {
    this.selectedProject = project;
    sessionStorage.setItem('selectedProject', JSON.stringify(project));
    this.router.navigate(['/ProjectInformation'], { state: { selectedProject: project } });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['..']);
  }
}

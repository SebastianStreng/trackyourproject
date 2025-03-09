import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePropertyComponent } from "../../features/create-property/create-property.component";
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project-service/project-service';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';
import { ProjectData } from 'src/app/core/TestData/ProjectData';

@Component({
  selector: 'app-selection-page',
  imports: [CommonModule, CreatePropertyComponent, SmartphoneCardComponent],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.css',
})
export class SelectionPageComponent {

  constructor(private router: Router, private projectService: ProjectService, private authService: AuthenticationService) {}

  navigateToYourProjects() {
    const currentUser = this.authService.getCurrentProjectMember();
  
    this.projectService.getAll().subscribe({
      next: (projects: any[]) => {
        const userProjects = projects.filter(project =>
          project.members && project.members.some((member: { id: number }) => member.id === currentUser?.id)
        );
  
        sessionStorage.setItem('projects', JSON.stringify(userProjects));
        this.router.navigate(['/Projects']);
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
  
  


  navigateToAllProjects() {
    this.projectService.getAll().subscribe({
      next: (projects: any[]) => {
        if (!projects || projects.length === 0) {
          console.warn('Keine Projekte aus der API, lade Testdaten.');
          projects = ProjectData.getProjects();
        }
        sessionStorage.setItem('projects', JSON.stringify(projects));
        this.router.navigate(['/Projects']);
      },
      error: (err) => {
        console.error('Fehler beim Abrufen der Projekte:', err);
        //const projects = ProjectData.getProjects();
        //sessionStorage.setItem('projects', JSON.stringify(projects));
        this.router.navigate(['/Projects']);
      }
    });
  }
  
}

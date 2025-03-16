import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Project } from 'src/app/core/models/project';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';

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

  constructor(private router: Router, private authService: AuthenticationService) {}

  ngOnInit(): void {
    // 🔥 Lade den eingeloggten Benutzer
    this.authService.getCurrentProjectMember().subscribe(user => {
      this.currentUser = user;
      console.log('Current User:', this.currentUser);
    });

    // 📌 Lade die Projekte aus dem Routing oder SessionStorage
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.projects = navigation.extras.state['projects'] || [];
      console.log('Projects received:', this.projects);
    } else {
      const storedProjects = sessionStorage.getItem('projects');
      this.projects = storedProjects ? JSON.parse(storedProjects) : [];
    }
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

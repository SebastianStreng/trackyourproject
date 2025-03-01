import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Project } from 'src/app/core/models/project';
import { ProjectData } from 'src/app/core/TestData/ProjectData';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.projects = navigation.extras.state['projects'] || [];
      console.log('Projects received:', this.projects);
    } else {
      const storedProjects = sessionStorage.getItem('projects');
      this.projects = storedProjects ? JSON.parse(storedProjects) : [];
    }
  }

  show(project: Project) {
    this. selectedProject = project; 
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Project } from 'src/app/core/models/project';

@Component({
  selector: 'app-your-project-page',
  imports: [CommonModule, SmartphoneCardComponent, TableModule, ButtonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'], 
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = []; 

  constructor(private router: Router) {}
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
  
    if (navigation?.extras.state) {
      this.projects = navigation.extras.state['projects'] || []; // ✅ Fix für Index-Signatur
      console.log('Projects received:', this.projects);
    } else {
      const storedProjects = sessionStorage.getItem('projects');
      this.projects = storedProjects ? JSON.parse(storedProjects) : [];
    }
  
    if (this.projects.length > 0) {
      console.log('Projects received:', this.projects);
    } else {
      console.error('No projects received!');
    }
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

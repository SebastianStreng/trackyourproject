import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared.module";
import { DialogCardComponent } from "../../dialog-card/dialog-card.component";
import { TableModule } from 'primeng/table';
import { Project } from 'src/app/core/models/project';
import { CheckboxModule } from 'primeng/checkbox'
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project-service/project-service';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';



@Component({
  imports: [CommonModule, SharedModule, DialogCardComponent, TableModule, CheckboxModule ],
  templateUrl: './assign-to-new-project.component.html',
  styleUrl: './assign-to-new-project.component.css',
})
export class AssignToNewProjectComponent implements OnInit {
  projects: Project[] = [];
  selectedProjects: Project[] = []; // Stores selected projects

  constructor(
    private router: Router, 
    private projectService: ProjectService, 
    private projectMemberService: ProjectMemberService
  ) {} 

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation?.extras.state && navigation.extras.state['projects']) {
      this.projects = navigation.extras.state['projects'];
    } else {
      const storedProjects = sessionStorage.getItem('projects');
      this.projects = storedProjects ? JSON.parse(storedProjects) : [];
    }

    console.log('Projects:', this.projects);
    
    if (!Array.isArray(this.projects)) {
      this.projects = [];
    }
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
    console.log('Selected Projects:', this.selectedProjects);
  }

  goHome() {
    this.router.navigate(['Selection']);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  closeDialog() {
    this.router.navigate(['/']);
  }
}



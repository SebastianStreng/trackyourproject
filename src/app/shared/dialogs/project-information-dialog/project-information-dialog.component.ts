import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { Project, Task } from 'src/app/core/models/project';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-information-dialog',
  standalone: true, 
  imports: [CommonModule, SharedModule, ButtonModule, TableModule],
  templateUrl: './project-information-dialog.component.html',
  styleUrls: ['./project-information-dialog.component.css'],
})
export class ProjectInformationDialogComponent implements OnInit {
  project: Project | null = null;
  projectDescription = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['selectedProject']) {
      this.project = navigation.extras.state['selectedProject'];
      console.log('Project received from state:', this.project);
    } else {
      const storedProject = sessionStorage.getItem('selectedProject');
      this.project = storedProject ? JSON.parse(storedProject) : null;
      if (this.project) {
        console.log('Project loaded from sessionStorage:', this.project);
      } else {
        console.error('❌ No project found!');
      }
    }

    // **Initialisiere die Projektbeschreibung**
    if (this.project?.description) {
      this.projectDescription = this.project.description;
    }
  }

  closeDialog() {
    this.router.navigate(['/Projects']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/Projects']);
  }

  getAssignedTo(task: Task): string {
    if (!task.assignedTo) {
      return 'Unassigned';
    }
  
    if (typeof task.assignedTo === 'string') {
      return task.assignedTo; // ✅ Falls `assignedTo` eine Zeichenkette ist
    }
  
    if ('name' in task.assignedTo) {
      return task.assignedTo.name; // ✅ Falls `assignedTo` ein `ProjectMember` ist
    }
  
    return 'Unknown';
  }
  
}

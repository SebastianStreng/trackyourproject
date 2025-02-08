import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { Project } from 'src/app/core/models/project';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-project-information-dialog',
  standalone: true, // WICHTIG: Damit der Dialog dynamisch geladen werden kann
  imports: [CommonModule, SharedModule, ButtonModule, TableModule],
  templateUrl: './project-information-dialog.component.html',
  styleUrls: ['./project-information-dialog.component.css'],
})
export class ProjectInformationDialogComponent {
  project: Project | null = null;
  projectDescription = '';

  constructor() {
  }

  closeDialog() {

  }

  goHome() {

  }

  goBack() {

  }
}

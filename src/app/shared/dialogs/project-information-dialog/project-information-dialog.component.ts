import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-project-information-dialog',
  imports: [CommonModule, SharedModule],
  templateUrl: './project-information-dialog.component.html',
  styleUrl: './project-information-dialog.component.css',
})
export class ProjectInformationDialogComponent {}

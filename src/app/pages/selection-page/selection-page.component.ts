import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesModule } from '../pages.module';

@Component({
  selector: 'app-selection-page',
  imports: [CommonModule, PagesModule],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.css',
})
export class SelectionPageComponent {}

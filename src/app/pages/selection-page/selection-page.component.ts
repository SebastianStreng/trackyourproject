import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesModule } from '../pages.module';
import { CreatePropertyComponent } from "../../features/create-property/create-property.component";

@Component({
  selector: 'app-selection-page',
  imports: [CommonModule, PagesModule, CreatePropertyComponent],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.css',
})
export class SelectionPageComponent {}

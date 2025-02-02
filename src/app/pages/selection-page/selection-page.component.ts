import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePropertyComponent } from "../../features/create-property/create-property.component";
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection-page',
  imports: [CommonModule, CreatePropertyComponent, SmartphoneCardComponent],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.css',
})
export class SelectionPageComponent {

  constructor(private router: Router) {}

  navigateToYourProjects() {
    this.router.navigate(['/YourProjects']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePropertyComponent } from "../../features/create-property/create-property.component";
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project-service/project-service';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';

@Component({
  selector: 'app-selection-page',
  imports: [CommonModule, CreatePropertyComponent, SmartphoneCardComponent],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.css',
})
export class SelectionPageComponent {

  constructor(private router: Router, private projectService: ProjectService, private authService: AuthenticationService) {}

  navigateToYourProjects() {
    this.authService.getCurrentProjectMember().subscribe(currentUser => {
      if (currentUser) {
        this.router.navigate(['/Projects'], { queryParams: { filter: 'mine' } });
      } else {
        console.warn('No user found, redirecting to login.');
        this.router.navigate(['/Login']);
      }
    });
  }

  navigateToAllProjects() {
    this.router.navigate(['/Projects'], { queryParams: { filter: 'all' } });
  }

  navigateToEmployees(){
    this.router.navigate(['/AllEmployees']);
  }
}

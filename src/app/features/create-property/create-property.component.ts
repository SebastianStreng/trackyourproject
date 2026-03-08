import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';

@Component({
  selector: 'app-create-property',
  imports: [CommonModule],
  templateUrl: './create-property.component.html',
  styleUrl: './create-property.component.css',
})
export class CreatePropertyComponent {
  constructor(private router: Router, private authService: AuthenticationService) {}

  createProject() {
    this.router.navigate(['/CreateNewProject']);
  }

  logOut() {
    this.authService.logout();
  }
}

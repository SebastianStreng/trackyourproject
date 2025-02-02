import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SmartphoneCardComponent } from 'src/app/shared/smartphone-card/smartphone-card.component';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SmartphoneCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor (private authService: AuthenticationService, private router: Router) {
    
  }

  signIn() {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['Customize']);
      },
      (error) => {
        this.error = 'Invalid username or password';
      }
    );
  }
}

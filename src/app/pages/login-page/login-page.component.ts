import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ FormsModule importieren
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth-service/authentification-service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, SmartphoneCardComponent], // ✅ FormsModule hinzugefügt
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  email!: string;
  password!: string;
  errorMessage!: string;

  constructor(private router: Router, private authService: AuthenticationService) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      () => {
        console.log('Login successful!');
        this.router.navigate(['/dashboard']); 
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid email or password!';
      }
    );
  }

  register() {
    this.router.navigate(['/Register']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from "../../shared/smartphone-card/smartphone-card.component";
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { ProjectMemberService } from 'src/app/core/services/projectmember-service/projectmember-service';
import { ProjectMember } from 'src/app/core/models/project';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, SharedModule, SmartphoneCardComponent, InputTextModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent implements OnInit {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  passwordCheck!: string;
  errorMessage!: string;
  successMessage!: string;

  constructor(private router: Router, private memberService: ProjectMemberService) {}

  ngOnInit(): void {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.passwordCheck = "";
  }

  goHome() {
    this.router.navigate(['/Login']);
  }

  goBack() {
    this.router.navigate(['/Login']);
  }

  register() {
    // 1️⃣ Überprüfen, ob alle Felder ausgefüllt wurden
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.passwordCheck) {
      this.errorMessage = "All fields must be filled out!";
      return;
    }

    // 2️⃣ Überprüfen, ob Passwörter übereinstimmen
    if (this.password !== this.passwordCheck) {
      this.errorMessage = "Passwords do not match!";
      return;
    }

    // 3️⃣ Neues Mitglied erstellen
    const newMember: ProjectMember = {
      id: 0,
      name: `${this.firstName} ${this.lastName}`,
      email: this.email,
      password: this.password,
    };

    // 4️⃣ API-Aufruf zur Speicherung des Benutzers
    this.memberService.store(newMember).subscribe(
      (response) => {
        console.log('User successfully registered:', response);
        this.successMessage = "Registration successful! Redirecting to login...";
        this.errorMessage = "";

        // 5️⃣ Nach 5 Sekunden zur Login-Seite weiterleiten
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 5000);
      },
      (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = "Registration failed. Please try again.";
        this.successMessage = "";
      }
    );
  }
}

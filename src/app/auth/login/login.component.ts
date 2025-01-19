import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { SmartphoneCardComponent } from 'src/app/shared/shared/smartphone-card/smartphone-card.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, SharedModule, SmartphoneCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}

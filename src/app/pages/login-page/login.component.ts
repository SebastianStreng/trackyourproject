import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesModule } from '../pages.module';

@Component({
  selector: 'app-login',
  imports: [CommonModule, PagesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}

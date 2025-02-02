import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { SmartphoneCardComponent } from 'src/app/shared/smartphone-card/smartphone-card.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, SmartphoneCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  constructor () {
    
  }
}

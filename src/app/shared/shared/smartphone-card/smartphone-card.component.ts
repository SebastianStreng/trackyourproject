import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';


@Component({
  selector: 'app-smartphone-card',
  imports: [CommonModule, SharedModule],
  templateUrl: './smartphone-card.component.html',
  styleUrl: './smartphone-card.component.css',
})
export class SmartphoneCardComponent {}

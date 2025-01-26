import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dialog-card',
  imports: [CommonModule, CardModule],
  templateUrl: './dialog-card.component.html',
  styleUrl: './dialog-card.component.css',
})
export class DialogCardComponent {}

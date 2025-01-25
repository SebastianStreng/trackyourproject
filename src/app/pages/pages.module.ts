import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from '../shared/smartphone-card/smartphone-card.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SmartphoneCardComponent,
    ButtonModule,
    TableModule,
    DialogModule
  ],
  exports: [
    SmartphoneCardComponent, 
    ButtonModule, 
    TableModule, 
    DialogModule
  ]

})
export class PagesModule { }

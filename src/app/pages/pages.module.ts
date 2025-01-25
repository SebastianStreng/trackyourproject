import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from '../shared/shared/smartphone-card/smartphone-card.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SmartphoneCardComponent,
    ButtonModule,
    TableModule
  ],
  exports: [SmartphoneCardComponent, ButtonModule, TableModule]
})
export class PagesModule { }

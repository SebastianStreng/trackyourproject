import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from '../shared/shared/smartphone-card/smartphone-card.component';
import { ButtonModule } from 'primeng/button';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SmartphoneCardComponent,
    ButtonModule
  ],
  exports: [SmartphoneCardComponent, ButtonModule]
})
export class PagesModule { }

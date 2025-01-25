import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartphoneCardComponent } from '../shared/shared/smartphone-card/smartphone-card.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SmartphoneCardComponent
  ],
  exports: [SmartphoneCardComponent]
})
export class PagesModule { }

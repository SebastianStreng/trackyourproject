import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SmartphoneCardComponent } from './smartphone-card/smartphone-card.component';
import { DialogCardComponent } from './dialog-card/dialog-card.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardModule,
    SmartphoneCardComponent,
    DialogCardComponent
  ],
  exports: [CardModule, SmartphoneCardComponent, DialogCardComponent]
})
export class SharedModule { }

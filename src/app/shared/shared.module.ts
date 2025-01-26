import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SmartphoneCardComponent } from './smartphone-card/smartphone-card.component';
import { DialogCardComponent } from './dialog-card/dialog-card.component';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardModule,
    SmartphoneCardComponent,
    DialogCardComponent,
    IftaLabelModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    TableModule
  ],
  exports: [FormsModule, 
    CardModule, 
    SmartphoneCardComponent, 
    DialogCardComponent, 
    IftaLabelModule, 
    IconFieldModule, 
    InputIconModule, 
    ButtonModule, 
    TableModule
  ]

})
export class SharedModule { }

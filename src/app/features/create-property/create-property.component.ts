import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-property',
  imports: [CommonModule],
  templateUrl: './create-property.component.html',
  styleUrl: './create-property.component.css',
})
export class CreatePropertyComponent {
  constructor(private router: Router){

  }

  createProject (){
    this.router.navigate(['/CreateNewProject']); 
  }

  logOut(){
    this.router.navigate(['/Login']); 
  }
}

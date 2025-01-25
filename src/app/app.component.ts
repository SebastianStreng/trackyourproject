import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login-page/login.component';

@Component({
  imports: [RouterModule, LoginComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'trackyourproject';
}

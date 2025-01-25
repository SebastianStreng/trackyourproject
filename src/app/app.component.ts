import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login-page/login.component';
import { SelectionPageComponent } from "./pages/selection-page/selection-page.component";
import { YourProjectsComponent } from './pages/your-projects-page/your-projects.component';

@Component({
  imports: [RouterModule, LoginComponent, SelectionPageComponent, YourProjectsComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'trackyourproject';
}

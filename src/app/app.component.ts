import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login-page/login.component';
import { SelectionPageComponent } from "./pages/selection-page/selection-page.component";

@Component({
  imports: [RouterModule, LoginComponent, SelectionPageComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'trackyourproject';
}

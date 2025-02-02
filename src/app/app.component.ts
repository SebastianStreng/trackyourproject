import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login-page/login.component';
import { SelectionPageComponent } from "./pages/selection-page/selection-page.component";
import { YourProjectsComponent } from './pages/your-projects-page/your-projects.component';
import { ProjectInformationDialogComponent } from './shared/dialogs/project-information-dialog/project-information-dialog.component';
import { UserInformationDialogComponent } from './shared/dialogs/user-information-dialog/user-information-dialog.component';
import { DialogCardComponent } from "./shared/dialog-card/dialog-card.component";
import { RegisterComponent } from './pages/login-page/register/register.component';


@Component({
  imports: [
    RouterModule,
    LoginComponent,
    SelectionPageComponent,
    YourProjectsComponent,
    ProjectInformationDialogComponent,
    UserInformationDialogComponent,
    DialogCardComponent,
    RegisterComponent
],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'trackyourproject';
}

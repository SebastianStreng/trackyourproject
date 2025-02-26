import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login-page/login.component';
import { SelectionPageComponent } from "./pages/selection-page/selection-page.component";
import { ProjectsComponent } from './pages/projects-page/projects.component';
import { ProjectInformationDialogComponent } from './shared/dialogs/project-information-dialog/project-information-dialog.component';
import { UserInformationDialogComponent } from './shared/dialogs/user-information-dialog/user-information-dialog.component';
import { DialogCardComponent } from "./shared/dialog-card/dialog-card.component";
import { RegisterComponent } from './pages/login-page/register/register.component';
import { AddTaskComponent } from './shared/dialogs/add-task-dialog/add-task.component';
import { ShowChartDialogComponent } from "./shared/dialogs/show-chart-dialog/show-chart-dialog.component";
import { CreateProjectDialogComponent } from './shared/dialogs/create-project-dialog/create-project-dialog.component';


@Component({
  imports: [
    RouterModule,
    LoginComponent,
    SelectionPageComponent,
    ProjectsComponent,
    ProjectInformationDialogComponent,
    UserInformationDialogComponent,
    DialogCardComponent,
    RegisterComponent,
    AddTaskComponent,
    ShowChartDialogComponent,
    CreateProjectDialogComponent

],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'trackyourproject';
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectionPageComponent } from "./pages/selection-page/selection-page.component";
import { ProjectsComponent } from './pages/projects-page/projects.component';
import { ProjectInformationDialogComponent } from './shared/dialogs/project-information-dialog/project-information-dialog.component';
import { UserInformationDialogComponent } from './shared/dialogs/user-information-dialog/user-information-dialog.component';
import { DialogCardComponent } from "./shared/dialog-card/dialog-card.component";
import { AddTaskComponent } from './shared/dialogs/add-task-dialog/add-task.component';
import { ShowChartDialogComponent } from "./shared/dialogs/show-chart-dialog/show-chart-dialog.component";
import { CreateProjectDialogComponent } from './shared/dialogs/create-project-dialog/create-project-dialog.component';
import { AssignToNewProjectComponent } from './shared/dialogs/Assign-to-new-project-dialog/assign-to-new-project.component';
import { AssignUserToProjectComponent } from './shared/dialogs/assign-user-to-new-project-dialog/assign-user-to-project.component';
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { AllEmployeesPageComponent } from './pages/all-employees-page/all-employees-page.component';


@Component({
  imports: [
    RouterModule,
    SelectionPageComponent,
    ProjectsComponent,
    ProjectInformationDialogComponent,
    UserInformationDialogComponent,
    DialogCardComponent,
    AddTaskComponent,
    ShowChartDialogComponent,
    CreateProjectDialogComponent,
    AssignToNewProjectComponent,
    AssignUserToProjectComponent,
    LoginPageComponent,
    RegisterPageComponent,
    AllEmployeesPageComponent
],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'trackyourproject';
}

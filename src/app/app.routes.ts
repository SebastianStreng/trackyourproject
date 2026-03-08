import { Route } from '@angular/router';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';
import { ProjectsComponent } from './pages/projects-page/projects.component';
import { ProjectInformationDialogComponent } from './shared/dialogs/project-information-dialog/project-information-dialog.component';
import { AddTaskComponent } from './shared/dialogs/add-task-dialog/add-task.component';
import { ShowChartDialogComponent } from './shared/dialogs/show-chart-dialog/show-chart-dialog.component';
import { CreateProjectDialogComponent } from './shared/dialogs/create-project-dialog/create-project-dialog.component';
import { AssignToNewProjectComponent } from './shared/dialogs/Assign-to-new-project-dialog/assign-to-new-project.component';
import { AssignUserToProjectComponent } from './shared/dialogs/assign-user-to-new-project-dialog/assign-user-to-project.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AllEmployeesPageComponent } from './pages/all-employees-page/all-employees-page.component';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: LoginPageComponent },
  { path: 'Register', component: RegisterPageComponent },
  { path: 'Selection', component: SelectionPageComponent, canActivate: [authGuard] },
  { path: 'Projects', component: ProjectsComponent, canActivate: [authGuard] },
  { path: 'ProjectInformation', component: ProjectInformationDialogComponent, canActivate: [authGuard] },
  { path: 'AddOrUpdateTask', component: AddTaskComponent, canActivate: [authGuard] },
  { path: 'ShowChartDialog', component: ShowChartDialogComponent, canActivate: [authGuard] },
  { path: 'CreateNewProject', component: CreateProjectDialogComponent, canActivate: [authGuard] },
  { path: 'AssignToNewProject', component: AssignToNewProjectComponent, canActivate: [authGuard] },
  { path: 'AddUserToProject', component: AssignUserToProjectComponent, canActivate: [authGuard] },
  { path: 'AllEmployees', component: AllEmployeesPageComponent, canActivate: [authGuard] },
];

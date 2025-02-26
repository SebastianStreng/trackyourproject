import { Route } from '@angular/router';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';
import { ProjectsComponent } from './pages/projects-page/projects.component';
import { ProjectInformationDialogComponent } from './shared/dialogs/project-information-dialog/project-information-dialog.component';
import { AddTaskComponent } from './shared/dialogs/add-task-dialog/add-task.component';
import { ShowChartDialogComponent } from './shared/dialogs/show-chart-dialog/show-chart-dialog.component';
import { CreateProjectDialogComponent } from './shared/dialogs/create-project-dialog/create-project-dialog.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'Selection', pathMatch: 'full' }, // Standardroute
  { path: 'Projects', component: ProjectsComponent },
  { path: 'Selection', component: SelectionPageComponent },
  { path: 'ProjectInformation', component: ProjectInformationDialogComponent},
  { path: 'AddOrUpdateTask', component: AddTaskComponent},
  { path: 'ShowChartDialog', component: ShowChartDialogComponent},
  { path: 'CreateNewProject', component: CreateProjectDialogComponent},
];

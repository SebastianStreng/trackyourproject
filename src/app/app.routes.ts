import { Route } from '@angular/router';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';
import { ProjectsComponent } from './pages/projects-page/projects.component';
import { ProjectInformationDialogComponent } from './shared/dialogs/project-information-dialog/project-information-dialog.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'Selection', pathMatch: 'full' }, // Standardroute
  { path: 'Projects', component: ProjectsComponent },
  { path: 'Selection', component: SelectionPageComponent },
  { path: 'ProjectInformation', component: ProjectInformationDialogComponent},
];

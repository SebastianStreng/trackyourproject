import { Route } from '@angular/router';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';
import { ProjectsComponent } from './pages/projects-page/projects.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'Selection', pathMatch: 'full' }, // Standardroute
  { path: 'Projects', component: ProjectsComponent },
  { path: 'Selection', component: SelectionPageComponent },
];

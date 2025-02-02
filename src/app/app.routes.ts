import { Route } from '@angular/router';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';
import { YourProjectsComponent } from './pages/your-projects-page/your-projects.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'Selection', pathMatch: 'full' }, // Standardroute
  { path: 'YourProjects', component: YourProjectsComponent },
  { path: 'Selection', component: SelectionPageComponent },
];

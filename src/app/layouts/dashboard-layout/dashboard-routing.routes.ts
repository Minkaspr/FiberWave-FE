import { Routes } from '@angular/router';

export const DashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/overview/overview.component')
    .then(m => m.OverviewComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component')
    .then(m => m.UsersComponent)
  }
];

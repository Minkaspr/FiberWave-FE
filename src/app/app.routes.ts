import { Routes } from '@angular/router';
import { PublicRoutes } from './layouts/public-layout/public-routing.routes';
import { AuthRoutes } from './layouts/auth-layout/auth-routing.routes';
import { DashboardRoutes } from './layouts/dashboard-layout/dashboard-routing.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component')
    .then(m => m.PublicLayoutComponent),
    children: [
      ...PublicRoutes
    ]
  },
  {
    path: 'auth',
    children: [
      ...AuthRoutes
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component')
    .then(m => m.DashboardLayoutComponent),
    children: [...DashboardRoutes]
  }
];

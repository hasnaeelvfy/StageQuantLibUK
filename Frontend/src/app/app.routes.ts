import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'single-gilt',
    loadComponent: () => import('./pages/single-gilt/single-gilt.component').then(m => m.SingleGiltComponent)
  },
  {
    path: 'multi-gilt',
    loadComponent: () => import('./pages/multi-gilt/multi-gilt.component').then(m => m.MultiGiltComponent)
  },
  {
    path: 'signin',
    loadComponent: () => import('./pages/auth/signin/signin.component').then(m => m.SigninComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
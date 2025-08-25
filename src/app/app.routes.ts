import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'all-users', 
    loadComponent: () => import('./features/profile/all-users/all-users.component').then(m => m.AllUsersComponent) 
  },
  { 
    path: 'update-profile', 
    loadComponent: () => import('./features/profile/update-profile/update-profile.component').then(m => m.UpdateProfileComponent) 
  }
];


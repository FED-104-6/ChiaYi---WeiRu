import { Routes } from '@angular/router';

// Home & Auth
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('../app/features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Profile
  {
    path: 'all-users',
    loadComponent: () =>
      import('../app/features/profile/all-users/all-users.component').then(m => m.AllUsersComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../app/features/profile/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'update-profile',
    loadComponent: () =>
      import('../app/features/profile/update-profile/update-profile.component').then(m => m.UpdateProfileComponent)
  },

  // Messages
  {
    path: 'messages',
    loadComponent: () =>
      import('../app/features/messages/admin-view-messages/admin-view-messages.component').then(m => m.AdminViewMessagesComponent)
  },
  {
    path: 'my-messages',
    loadComponent: () =>
      import('../app/features/messages/customer-view-messages/customer-view-messages.component').then(m => m.CustomerViewMessagesComponent)
  },
 
  
  // Flats
  {
    path: 'flats',
    loadChildren: () =>
      import('./flats.routes').then(m => m.FLATS_ROUTES)
  },
  

  // 404 fallback
  { path: '**', redirectTo: 'home' }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home & Auth
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Profile
  {
    path: 'all-users',
    loadComponent: () =>
      import('./features/profile/all-users/all-users.component').then(m => m.AllUsersComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'update-profile',
    loadComponent: () =>
      import('./features/profile/update-profile/update-profile.component').then(m => m.UpdateProfileComponent)
  },

  // Messages
  {
    path: 'messages',
    loadComponent: () =>
      import('./features/messages/admin-view-messages/admin-view-messages.component').then(m => m.AdminViewMessagesComponent)
  },
  {
    path: 'my-messages',
    loadComponent: () =>
      import('./features/messages/customer-view-messages/customer-view-messages.component').then(m => m.CustomerViewMessagesComponent)
  },
  {
    path: 'host-messages',
    loadComponent: () =>
      import('./features/messages/host-messages/host-messages.component').then(m => m.HostMessagesComponent)
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

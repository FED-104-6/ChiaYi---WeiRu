import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // 角色共用
  { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },

  // Admin 專用
  { path: 'all-users', loadComponent: () => import('./features/profile/all-users/all-users.component').then(m => m.AllUsersComponent) },
  { path: 'admin-view-flat', loadComponent: () => import('./features/flats/admin-view-flat/admin-view-flat.component').then(m => m.AdminViewFlatComponent) },
  { path: 'admin-view-messages', loadComponent: () => import('./features/messages/admin-view-messages/admin-view-messages.component').then(m => m.AdminViewMessagesComponent) },

  // Admin & Host
  { path: 'profile', loadComponent: () => import('./features/profile/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'update-profile', loadComponent: () => import('./features/profile/update-profile/update-profile.component').then(m => m.UpdateProfileComponent) },

  // Host
  { path: 'host-messages', loadComponent: () => import('./features/messages/host-messages/host-messages.component').then(m => m.HostMessagesComponent) },

  // Guest
  { path: 'my-account', loadComponent: () => import('./features/profile/my-account/my-account.component').then(m => m.MyAccountComponent) },
  { path: 'my-messages', loadComponent: () => import('./features/messages/customer-view-messages/customer-view-messages.component').then(m => m.CustomerViewMessagesComponent) },

  // Flats 懶加載
  { path: 'flats', loadChildren: () => import('../app/flats.routes').then(m => m.FLATS_ROUTES) }
];

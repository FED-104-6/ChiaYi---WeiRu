// src/app/features/flats/flats.routes.ts
import { Routes } from '@angular/router';
import { NewFlatComponent } from './features/flats/new-flat/new-flat.component';
import { EditFlatComponent } from './features/flats/edit-flat/edit-flat.component';
import { FavouritesComponent } from './features/flats/favourites/favourites.component';
import { MyFlatsComponent } from './features/flats/my-flats/my-flats.component';
import { ViewFlatComponent } from './features/flats/view-flat/view-flat.component';

export const FLATS_ROUTES: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'new-flat', loadComponent: () => import('./features/flats/new-flat/new-flat.component').then(m => m.NewFlatComponent) },
  { path: 'edit-flat', loadComponent: () => import('./features/flats/edit-flat/edit-flat.component').then(m => m.EditFlatComponent) },
  { path: 'edit-flat/:id', loadComponent: () => import('./features/flats/edit-flat/edit-flat.component').then(m => m.EditFlatComponent) },
  { path: 'favourites', loadComponent: () => import('./features/flats/favourites/favourites.component').then(m => m.FavouritesComponent) },
  { path: 'my-flats', loadComponent: () => import('./features/flats/my-flats/my-flats.component').then(m => m.MyFlatsComponent) },
  { path: 'view-flat/:id', loadComponent: () => import('./features/flats/view-flat/view-flat.component').then(m => m.ViewFlatComponent) }
];

import { NewFlatComponent } from './features/flats/new-flat/new-flat.component';

export const routes = [
  { path: 'new-flat', component: NewFlatComponent },
  { path: '', redirectTo: 'new-flat', pathMatch: 'full' }
];

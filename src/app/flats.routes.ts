import { Routes } from '@angular/router';
import { NewFlatComponent } from './features/flats/new-flat/new-flat.component';
import { EditFlatComponent } from './features/flats/edit-flat/edit-flat.component';
import { FavouritesComponent } from './features/flats/favourites/favourites.component';
import { MyFlatsComponent } from './features/flats/my-flats/my-flats.component';
import { SearchComponent } from './features/flats/search/search.component';
import { ViewFlatComponent } from './features/flats/view-flat/view-flat.component';

export const FLATS_ROUTES: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'new-flat', component: NewFlatComponent },
  { path: 'edit-flat/:id', component: EditFlatComponent },
  { path: 'favourites', component: FavouritesComponent },
  { path: 'my-flats', component: MyFlatsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'view-flat/:id', component: ViewFlatComponent }
];

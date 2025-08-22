import { Routes } from '@angular/router';

// 🎯 修正：所有 features/flats 下的元件都需完整路徑
import { NewFlatComponent } from './features/flats/new-flat/new-flat.component';
import { EditFlatComponent } from './features/flats/edit-flat/edit-flat.component';
import { FavouritesComponent } from './features/flats/favourites/favourites.component';
import { MyFlatsComponent } from './features/flats/my-flats/my-flats.component';
import { SearchComponent } from './features/flats/search/search.component';
import { ViewFlatComponent } from './features/flats/view-flat/view-flat.component';

export const routes: Routes = [
  // 設定每個元件對應的路徑
  { path: 'new-flat', component: NewFlatComponent },
  { path: 'edit-flat', component: EditFlatComponent },
  { path: 'favourites', component: FavouritesComponent },
  { path: 'my-flats', component: MyFlatsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'view-flat', component: ViewFlatComponent },

  // 設定首頁的重定向
  { path: '', redirectTo: 'new-flat', pathMatch: 'full' }
];
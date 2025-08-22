import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a routerLink="/edit-flat">Edit flat</a> |
      <a routerLink="/new-flat">New flat</a> |
      <a routerLink="/favourites">Favourites</a> |
      <a routerLink="/my-flats">My flats</a> |
      <a routerLink="/search">Search</a> |
      <a routerLink="/view-flat">View flat</a>
    </nav>
    <hr>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}

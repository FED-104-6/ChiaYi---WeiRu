import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFlatComponent } from '../view-flat/view-flat.component';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, ViewFlatComponent],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent {
  favourites = [
    { name: 'Flat C', price: 2000, beds: 2, description: 'Cozy flat' },
    { name: 'Flat D', price: 2500, beds: 3, description: 'Modern flat' }
  ];
}

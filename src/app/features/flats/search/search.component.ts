import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewFlatComponent, Flat } from '../view-flat/view-flat.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ViewFlatComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  query: string = '';
  flats: Flat[] = [
    { name: 'Flat A', price: 1000, beds: 2, description: 'Nice flat' },
    { name: 'Flat B', price: 1500, beds: 3, description: 'Spacious flat' },
    { name: 'Flat C', price: 2000, beds: 2, description: 'Cozy flat' }
  ];

  get filteredFlats(): Flat[] {
    return this.flats.filter(flat =>
      flat.name.toLowerCase().includes(this.query.toLowerCase())
    );
  }
}

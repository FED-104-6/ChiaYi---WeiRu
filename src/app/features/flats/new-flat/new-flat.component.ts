import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Flat {
  name: string;
  price: number;
  beds: number;
  description: string;
  image: string;
}

@Component({
  selector: 'app-new-flat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-flat.component.html',
  styleUrls: ['./new-flat.component.scss']
})
export class NewFlatComponent {
  addedFlats: Flat[] = [
    { name: 'Loft Oasis', price: 2500, beds: 1, description: 'Chic urban loft with high ceilings and a balcony.', image: 'assets/loft1.avif' },
    { name: 'Riverside Retreat', price: 3200, beds: 3, description: 'Spacious flat with stunning river views and modern amenities.', image: 'assets/Riverside Retreat.avif' },
    { name: 'Garden Studio', price: 1800, beds: 1, description: 'Cozy studio apartment with a private garden patio.', image: 'assets/garden .avif' },
  ];

  constructor() {}
}
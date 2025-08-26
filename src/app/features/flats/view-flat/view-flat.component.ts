import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Flat {
  id: number;
  name: string;
  price: number;
  beds: number;
  description: string;
  image: string;
}

@Component({
  selector: 'app-view-flat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-flat.component.html',
  styleUrls: ['./view-flat.component.scss']
})
export class ViewFlatComponent implements OnInit {
  flats: Flat[] = [
    { 
      id: 1, 
      name: 'Cozy Apartment in Downtown', 
      price: 1200, 
      beds: 2, 
      description: 'A modern and comfortable apartment located in the heart of the city, perfect for small families or couples.', 
      image: 'assets/cozy.avif'
    },
    { 
      id: 2, 
      name: 'Spacious Flat with Balcony', 
      price: 1800, 
      beds: 3, 
      description: 'Enjoy stunning views from the balcony of this spacious flat. Ideal for families who love open spaces.', 
      image: 'assets/balcony.webp'
    },
    { 
      id: 3, 
      name: 'Minimalist Studio', 
      price: 900, 
      beds: 1, 
      description: 'A stylish studio with minimalist design. Great for singles or business travelers looking for convenience.', 
      image: 'assets/studio.avif'
    }
  ];

  ngOnInit(): void {
    // Display all flats (no route param needed)
  }
}

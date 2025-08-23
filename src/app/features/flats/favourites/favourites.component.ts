import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Define the data structure for a Flat, ensuring each object has an ID and an image path
export interface Flat {
  id: number;
  name: string;
  price: number;
  beds: number;
  description: string;
  image: string; // New property for image path
}

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink], // Import CommonModule and RouterLink
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'] // Note: using .scss for styles
})
export class FavouritesComponent {
  // Define the 'favourites' array, ensuring each object has a unique ID and an image path
  favourites: Flat[] = [
    {
      id: 1,
      name: 'Lovely Downtown Loft',
      price: 1200,
      beds: 2,
      description: 'Experience city life in this beautifully renovated loft. Perfect for couples or small families.',
      image:'assets/loft.avif'  // Placeholder image
    },
    {
      id: 2,
      name: 'Spacious Family Home',
      price: 2500,
      beds: 4,
      description: 'A large, airy home with a backyard, ideal for family vacations. Close to parks and amenities.',
      image: 'assets/spacious home.webp'  // Placeholder image
    },
    {
      id: 3,
      name: 'Cozy Lakeside Cabin',
      price: 900,
      beds: 1,
      description: 'Escape to nature in this charming cabin by the lake. Enjoy peace and tranquility.',
      image: 'assets/cabin.webp' // Placeholder image
    },
    {
      id: 4,
      name: 'Modern Apartment',
      price: 1800,
      beds: 3,
      description: 'Sleek and stylish apartment with panoramic city views. Features a fully equipped kitchen.',
      image: 'assets/modern apartment.avif'  // Placeholder image
    }
  ];
}

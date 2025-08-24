import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Flat {
  id: number;
  name: string;
  price: number;
  beds: number;
  description: string;
  image: string;
}

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent {
  favourites: Flat[] = [
    {
      id: 1,
      name: 'Lovely Downtown Loft',
      price: 1200,
      beds: 2,
      description: 'Experience city life in this beautifully renovated loft. Perfect for couples or small families.',
      image:'assets/loft.avif'
    },
    {
      id: 2,
      name: 'Spacious Family Home',
      price: 2500,
      beds: 4,
      description: 'A large, airy home with a backyard, ideal for family vacations. Close to parks and amenities.',
      image: 'assets/spacious home.webp'
    },
    {
      id: 3,
      name: 'Cozy Lakeside Cabin',
      price: 900,
      beds: 1,
      description: 'Escape to nature in this charming cabin by the lake. Enjoy peace and tranquility.',
      image: 'assets/cabin.webp'
    },
    {
      id: 4,
      name: 'Modern Apartment',
      price: 1800,
      beds: 3,
      description: 'Sleek and stylish apartment with panoramic city views. Features a fully equipped kitchen.',
      image: 'assets/modern apartment.avif'
    },
    {
      id: 5,
      name: 'Beachfront Villa',
      price: 3200,
      beds: 5,
      description: 'Luxury villa right by the beach. Perfect for large families or group getaways with sea views.',
      image: 'assets/beach.avif' 
    },
    {
      id: 6,
      name: 'Mountain Retreat',
      price: 1400,
      beds: 2,
      description: 'A peaceful retreat surrounded by mountains. Ideal for those seeking fresh air and hiking trails.',
      image: 'assets/mountain.avif' 
    }
  ];

  removeFromFavorites(id: number) {
    this.favourites = this.favourites.filter(flat => flat.id !== id);
  }
}

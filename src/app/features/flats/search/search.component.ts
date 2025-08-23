import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// 修改 Flat 介面，加入 image 屬性
export interface Flat {
  id: number;
  name: string;
  price: number;
  beds: number;
  description: string;
  image: string; // 新增圖片路徑屬性
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  flats: Flat[] = [
    { 
      id: 1, 
      name: 'Flat A', 
      price: 1000, 
      beds: 2, 
      description: 'A cozy two-bedroom flat with a great view.',
      image:  'assets/room1.avif'  // 指定圖片路徑
    },
    { 
      id: 2, 
      name: 'Flat B', 
      price: 1500, 
      beds: 3, 
      description: 'A spacious three-bedroom flat in the city center.',
      image:  'assets/room2.avif'  // 指定圖片路徑
    },
    { 
      id: 3, 
      name: 'Flat C', 
      price: 2000, 
      beds: 2, 
      description: 'A modern and stylish two-bedroom flat with a large balcony.',
      image: 'assets/room3.avif' // 指定圖片路徑
    }
  ];
}
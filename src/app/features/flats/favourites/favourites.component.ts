import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// 定義 Flat 的資料結構，確保每個物件都有 ID
export interface Flat {
  id: number;
  name: string;
  price: number;
  beds: number;
  description: string;
}

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink], // 匯入 RouterLink 以使用 routerLink 指令
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent {
  // 定義 favourites 陣列，並確保每個物件都有唯一的 id
  favourites: Flat[] = [
    { id: 1, name: 'Flat A', price: 1000, beds: 2, description: 'Nice flat' },
    { id: 2, name: 'Flat B', price: 1500, beds: 3, description: 'Spacious flat' },
    { id: 3, name: 'Flat C', price: 2000, beds: 2, description: 'Cozy flat' }
  ];
}
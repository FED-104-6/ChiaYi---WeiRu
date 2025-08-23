import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Flat } from '../view-flat/view-flat.component';

@Component({
  selector: 'app-search',
  standalone: true, // 將元件設定為獨立元件
  imports: [CommonModule, RouterLink], // 匯入 CommonModule 和 RouterLink
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  flats: Flat[] = [
    { id: 1, name: 'Flat A', price: 1000, beds: 2, description: 'Nice flat' },
    { id: 2, name: 'Flat B', price: 1500, beds: 3, description: 'Spacious flat' },
    { id: 3, name: 'Flat C', price: 2000, beds: 2, description: 'Cozy flat' }
  ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Flat {
  id: number;
  name: string;
  price: number;
  beds: number;
  description: string;
  image: string;
  modalImage: string; // 新增：用於彈出視窗的圖片
  fullDescription: string; // 新增：更詳細的描述
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
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
      image: 'assets/room1.avif',
      modalImage: 'assets/cozy2.webp', // 替換成不同的圖片路徑
      fullDescription: 'This cozy two-bedroom flat is a perfect urban retreat. It features a spacious living area, modern kitchen, and stunning city views from the balcony. It is located in a quiet neighborhood but is just a short walk from cafes and public transport.',
    },
    { 
      id: 2, 
      name: 'Flat B', 
      price: 1500, 
      beds: 3, 
      description: 'A spacious three-bedroom flat in the city center.', 
      image: 'assets/room2.avif',
      modalImage: 'assets/spacious2.webp',
      fullDescription: 'Experience city living at its best in this spacious three-bedroom flat. The open-plan layout is ideal for entertaining, and the large windows fill the space with natural light. Includes access to a private gym and rooftop pool.',
    },
    { 
      id: 3, 
      name: 'Flat C', 
      price: 2000, 
      beds: 2, 
      description: 'A modern and stylish two-bedroom flat with a large balcony.', 
      image: 'assets/room3.avif',
      modalImage: 'assets/modern2.avif',
      fullDescription: 'A truly modern and stylish flat with premium finishes. The expansive balcony offers a perfect spot to relax and enjoy the sunset. The building has 24/7 security and is close to all major shopping and dining districts.',
    }
  ];

  selectedFlat: Flat | null = null;

  openModal(flat: Flat) {
    this.selectedFlat = flat;
  }

  closeModal() {
    this.selectedFlat = null;
  }
}
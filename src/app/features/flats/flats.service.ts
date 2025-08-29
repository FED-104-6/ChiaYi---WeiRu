import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Flat {
  id: number;
  name: string;
  price: number;
  beds: number;
  description: string;
  image: string;
  modalImage: string;
  fullDescription: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlatService {
  private flats: Flat[] = [
    {
      id: 1,
      name: 'Flat A',
      price: 1000,
      beds: 2,
      description: 'A cozy two-bedroom flat with a great view.',
      image: 'assets/room1.avif',
      modalImage: 'assets/cozy2.webp',
      fullDescription:
        'This cozy two-bedroom flat is a perfect urban retreat. It features a spacious living area, modern kitchen, and stunning city views from the balcony.'
    },
    {
      id: 2,
      name: 'Flat B',
      price: 1500,
      beds: 3,
      description: 'A spacious three-bedroom flat in the city center.',
      image: 'assets/room2.avif',
      modalImage: 'assets/spacious2.webp',
      fullDescription:
        'Experience city living at its best in this spacious three-bedroom flat. The open-plan layout is ideal for entertaining.'
    },
    {
      id: 3,
      name: 'Flat C',
      price: 2000,
      beds: 2,
      description: 'A modern and stylish two-bedroom flat with a large balcony.',
      image: 'assets/room3.avif',
      modalImage: 'assets/modern2.avif',
      fullDescription:
        'A truly modern and stylish flat with premium finishes. The expansive balcony offers a perfect spot to relax and enjoy the sunset.'
    }
  ];

  private flatsSubject = new BehaviorSubject<Flat[]>(this.flats);
  flats$ = this.flatsSubject.asObservable();

  /** 取得所有 flats */
  getAllFlats(): Flat[] {
    return [...this.flats];
  }

  /** 搜尋 flats（名稱或描述匹配） */
  searchFlats(keyword: string): Flat[] {
    if (!keyword.trim()) return this.getAllFlats();
    const lower = keyword.toLowerCase();
    return this.flats.filter(
      f =>
        f.name.toLowerCase().includes(lower) ||
        f.description.toLowerCase().includes(lower)
    );
  }

  /** 更新搜尋結果 */
  updateFlats(keyword: string): void {
    const result = this.searchFlats(keyword);
    this.flatsSubject.next(result);
  }
}

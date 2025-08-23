import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

export interface Flat {
  id: number;
  name: string;
  price: number;
  beds: number;
  description: string;
}

@Component({
  selector: 'app-view-flat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-flat.component.html',
  styleUrls: ['./view-flat.component.css'] // 請確認這裡的副檔名是 .css
})
export class ViewFlatComponent implements OnInit {
  flat: Flat | undefined;

  flats: Flat[] = [
    { id: 1, name: 'Flat A', price: 1000, beds: 2, description: '這是一個舒適的公寓，適合小家庭居住。' },
    { id: 2, name: 'Flat B', price: 1500, beds: 3, description: '寬敞的公寓，擁有陽台與絕佳視野。' },
    { id: 3, name: 'Flat C', price: 800, beds: 1, description: '單身公寓，交通便利，生活機能完善。' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.flat = this.flats.find(f => f.id === id);

    if (!this.flat) {
      console.error('Flat not found for ID:', id);
    }
  }
}
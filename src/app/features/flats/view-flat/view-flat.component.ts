import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Flat {
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
  styleUrls: ['./view-flat.component.scss']
})
export class ViewFlatComponent {
  @Input() flat!: Flat; // 接收父 component 的資料
}
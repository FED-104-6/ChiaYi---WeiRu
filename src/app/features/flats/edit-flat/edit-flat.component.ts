import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Flat 型別定義
export interface Flat {
  name: string;
  price: number;
  beds: number;
  description: string;
}

@Component({
  selector: 'app-edit-flat',
  templateUrl: './edit-flat.component.html',
  styleUrls: ['./edit-flat.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class EditFlatComponent implements OnInit {
  flat!: Flat; // ngOnInit 中初始化

  ngOnInit(): void {
    // 模擬從後端取得資料
    this.flat = {
      name: 'Sample Flat',
      price: 1000,
      beds: 2,
      description: 'This is a demo flat for testing.'
    };
  }

  save(): void {
    console.log('Saved flat:', this.flat);
    alert('Flat updated!');
  }
}

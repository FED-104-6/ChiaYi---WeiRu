import { Component, OnInit } from '@angular/core'; // 🎯 新增 OnInit
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
// 🎯 繼承 OnInit 介面
export class EditFlatComponent implements OnInit { 
  // 🎯 宣告 flat 屬性，不給予初始值，因為它會在 ngOnInit 中被賦值
  flat!: Flat; 

  // 🎯 在 ngOnInit 中進行資料初始化
  ngOnInit(): void {
    // 在這裡模擬從後端服務取得資料的過程
    // 實際應用中，通常會呼叫一個服務來取得資料
    // 例如：this.flatService.getFlat(id).subscribe(data => this.flat = data);
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
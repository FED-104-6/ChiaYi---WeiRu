import { Component } from '@angular/core';

@Component({
  selector: 'app-new-flat',
  template: `
    <div class="new-flat-form">
      <!-- 在此處插入 HTML 內容 -->
    </div>
  `,
  styles: [`
    .new-flat-form {
      /* 在此處插入 CSS 內容 */
    }
  `]
})
export class NewFlatComponent {
  flat = { name: '', price: 0, beds: 0, description: '' };

  onSubmit() {
    // 處理新增邏輯
    console.log('New flat added:', this.flat);
  }
}

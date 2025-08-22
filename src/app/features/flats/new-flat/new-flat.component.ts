import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-flat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-flat.component.html',
  styleUrls: ['./new-flat.component.scss']
})
export class NewFlatComponent {
  flat = { name: '', price: 0, beds: 0, description: '' };

  onSubmit(): void {
    if (!this.flat.name || this.flat.price <= 0 || this.flat.beds <= 0 || !this.flat.description) {
      alert('請填寫所有欄位，並確保價格和床位數大於 0。');
      return;
    }

    setTimeout(() => {
      console.log('New flat added:', this.flat);
      alert('公寓已成功新增！');
      this.resetForm();
    }, 500);
  }

  private resetForm(): void {
    this.flat = { name: '', price: 0, beds: 0, description: '' };
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent {
  profileImage: string | ArrayBuffer | null = null;

  profileFields = [
    { key: 'fullName', label: 'Full Name', value: 'Ben Chang' },
    { key: 'phoneNumber', label: 'Phone Number', value: '+1 234 567 890' },
    { key: 'email', label: 'Email', value: 'bnb0857@gmail.com' },
    { key: 'password', label: 'Password', value: '********' }
  ];

  editingField: string | null = null;
  editValue: string = '';
  showPassword: boolean = false; // 控制密碼是否顯示

  // 上傳大頭貼
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.profileImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // 點擊編輯按鈕
  editField(fieldKey: string) {
    this.editingField = fieldKey;
    const field = this.profileFields.find(f => f.key === fieldKey);
    if (field) {
      this.editValue = field.value;
      this.showPassword = false; // 每次編輯密碼時預設隱藏
    }
  }

  // 切換密碼可見
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // 儲存編輯
  saveEdit() {
    const field = this.profileFields.find(f => f.key === this.editingField);
    if (field) {
      if (field.key === 'password' && !this.showPassword) {
        // 儲存時仍可隱藏密碼
        field.value = '*'.repeat(this.editValue.length);
      } else {
        field.value = this.editValue;
      }
    }
    this.cancelEdit();
  }

  // 取消編輯
  cancelEdit() {
    this.editingField = null;
    this.editValue = '';
    this.showPassword = false;
  }

  // 取得欄位標籤
  getFieldLabel(key: string): string {
    const field = this.profileFields.find(f => f.key === key);
    return field ? field.label : '';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthUser } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  profileImage: string | ArrayBuffer | null = null;

  profileFields = [
    { key: 'fullName', label: 'Full Name', value: '' },
    { key: 'phoneNumber', label: 'Phone Number', value: '' },
    { key: 'email', label: 'Email', value: '' },
    { key: 'password', label: 'Password', value: '********' }
  ];

  editingField: string | null = null;
  editValue: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user: AuthUser | null = this.authService.currentUser();
    if (user) {
      // ✅ 如果有 avatarUrl，直接顯示
      this.profileImage = user.avatarUrl || null;

      this.profileFields = this.profileFields.map(f => {
        switch (f.key) {
          case 'fullName': return { ...f, value: user.displayName || '' };
          case 'email': return { ...f, value: user.email || '' };
          case 'phoneNumber': return { ...f, value: user.phonenumber || '' };
          default: return f;
        }
      });
    }
  }

  // ✅ 上傳頭像並同步 Firestore
  async onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.profileImage = reader.result;
      reader.readAsDataURL(file);

      try {
        const downloadUrl = await this.authService.uploadProfilePhoto(file);
        this.profileImage = downloadUrl; // 確保顯示最新頭像
      } catch (error) {
        console.error('Failed to upload profile photo:', error);
      }
    }
  }

  editField(fieldKey: string) {
    this.editingField = fieldKey;
    const field = this.profileFields.find(f => f.key === fieldKey);
    if (field) {
      this.editValue = field.value;
      this.showPassword = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async saveEdit() {
    const field = this.profileFields.find(f => f.key === this.editingField);
    if (field) {
      if (field.key === 'password' && !this.showPassword) {
        field.value = '*'.repeat(this.editValue.length);
      } else {
        field.value = this.editValue;
      }

      if (this.editingField) {
        await this.authService.updateProfileField(this.editingField, this.editValue);
      }
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingField = null;
    this.editValue = '';
    this.showPassword = false;
  }

  getFieldLabel(key: string): string {
    const field = this.profileFields.find(f => f.key === key);
    return field ? field.label : '';
  }
}

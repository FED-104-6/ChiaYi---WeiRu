import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthUser } from '../../../features/auth/auth.service';
import { Observable } from 'rxjs';

interface ProfileField {
  key: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  profileFields: ProfileField[] = [
    { key: 'fullName', label: 'Name', value: '' },
    { key: 'phonenumber', label: 'Phone', value: '' },
    { key: 'email', label: 'Email', value: '' },
    { key: 'password', label: 'Password', value: '********' },
    { key: 'country', label: 'Country', value: '' },
    { key: 'address', label: 'Address', value: '' },
    { key: 'birthdate', label: 'Birth Date', value: '' }
  ];

  editingField: string | null = null;
  editValue: string = '';
  showPassword: boolean = false;
  profileImage: string = '';

  user$: Observable<AuthUser | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.profileFields.forEach(f => {
          switch (f.key) {
            case 'fullName':
              f.value = user.displayName || '';
              break;
            case 'phonenumber':
              f.value = user.phonenumber || '';
              break;
            case 'email':
              f.value = user.email || '';
              break;
            case 'country':
              f.value = (user as any).country || '';
              break;
            case 'address':
              f.value = (user as any).address || '';
              break;
            case 'birthdate':
              f.value = (user as any).birthdate || '';
              break;
            case 'password':
              f.value = '********';
              break;
          }
        });
        this.profileImage = user.avatarUrl || '';
      }
    });
  }

  editField(key: string) {
    this.editingField = key;
    const field = this.profileFields.find(f => f.key === key);
    this.editValue = field?.value || '';
  }

  cancelEdit() {
    this.editingField = null;
    this.editValue = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async saveEdit() {
    if (!this.editingField) return;
    try {
      // 使用 AuthService 更新 Firestore
      await this.authService.updateProfileField(this.editingField, this.editValue);

      // 更新本地 UI
      const field = this.profileFields.find(f => f.key === this.editingField);
      if (field) field.value = this.editValue;

      this.editingField = null;
      this.editValue = '';
    } catch (error) {
      console.error('Save edit failed:', error);
    }
  }

  async onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    try {
      const imageUrl = await this.authService.uploadProfilePhoto(file);
      this.profileImage = imageUrl;
    } catch (error) {
      console.error('Upload image failed:', error);
    }
  }

  getFieldLabel(key: string) {
    const field = this.profileFields.find(f => f.key === key);
    return field?.label || '';
  }
}

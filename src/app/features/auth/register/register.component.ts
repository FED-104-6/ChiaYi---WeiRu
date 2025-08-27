import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showLogin: boolean = false; 
  fullname: string = '';
  phonenumber: string = '';
  email: string = '';
  password: string = '';
  country: string = '';
  role: 'host' | 'guest' | '' = '';  // ✅ 新增角色欄位
  errorMessage: string = '';

  language: 'en' | 'zh' = 'en';
  currentSlide = 5;
  totalSlides = 5;
  isPaused = false;
  
  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showLogin = true;
    }, 50);
  }

  // ✅ Registration method
  async onRegister(): Promise<void> {
    this.errorMessage = '';

    // ✅ 驗證必要欄位
    if (!this.fullname || !this.email || !this.password || !this.country || !this.phonenumber) {
      this.errorMessage = this.language === 'en' 
        ? 'Please fill in all required fields' 
        : '請填寫所有必填欄位';
      return;
    }

    // ✅ 驗證角色是否已選擇
    if (!this.role) {
      this.errorMessage = this.language === 'en' ? 'Please select a role' : '請選擇註冊身份';
      return;
    }

    try {
      // ✅ 呼叫 Firebase AuthService 註冊，並傳入角色
      await this.authService.register(
        this.fullname,  
        this.email,    
        this.password,  
        this.country,   
        this.phonenumber,
        this.role   
      );

      // ✅ 註冊成功 → 導向首頁
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = error.message || (this.language === 'en'
        ? 'Registration failed, please try again'
        : '註冊失敗，請再試一次');
    }
  }
}

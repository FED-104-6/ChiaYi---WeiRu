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
  email: string = '';
  password: string = '';
  country: string = '';
  phonenumber: string = '';
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

  // Registration method
  async onRegister(): Promise<void> {
    this.errorMessage = '';
  
    try {
      // 呼叫 Firebase AuthService 註冊
      await this.authService.register(
        this.fullname,
        this.email,
        this.password,
        this.country,
        this.phonenumber
      );
  
      // 註冊成功 → 導向首頁
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = error.message || 'Registration failed, please try again';
    }
  }
  
}

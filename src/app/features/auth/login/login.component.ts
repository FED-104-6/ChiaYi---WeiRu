import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showLogin: boolean = false;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  language: 'en' | 'zh' = 'en';
  currentSlide = 5;
  totalSlides = 5;
  isPaused = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    setTimeout(() => {
      this.showLogin = true;
    }, 50);
  }

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  async onLogin(): Promise<void> {
    this.errorMessage = '';
    try {
      // 直接呼叫 login，失敗會 throw error
      await this.authService.login(this.email, this.password);
      
      // 登入成功 → 導向首頁
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message || 'Login failed, please try again later';
    }
  }
}

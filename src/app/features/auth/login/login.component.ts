import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../core/header/header.component';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-login',              
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './login.component.html', 
  styleUrls: ['./login.component.css']  
})
export class LoginComponent {         
  language: 'en' | 'zh' = 'en';
  currentSlide = 5;
  totalSlides = 5;
  isPaused = false;

  showLogin = true;
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  logout() {
    this.authService.logout();
    this.showLogin = true; // 登出後顯示登入卡
  }

  // 登入表單事件，用 async/await 呼叫 Promise
  async onLogin() {
    try {
      await this.authService.login(this.email, this.password);
      this.errorMessage = '';
      this.showLogin = false;
      this.router.navigate(['/profile']); // 登入成功跳轉 Profile
    } catch (err: any) {
      this.errorMessage = 'Login failed. Please check your credentials.';
      console.error(err);
    }
  }
}

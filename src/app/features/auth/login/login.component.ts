import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../features/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  showLogin: boolean = false;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  language: 'en' | 'zh' = 'en';

  isLoggedIn: boolean = false; // ← 新增
  private sub!: Subscription;   // ← 用來訂閱 AuthService 狀態

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showLogin = true;
    }, 50);

    // 訂閱登入狀態
    this.sub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  async onLogin(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      // 導向首頁已在 AuthService 內處理
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message || 'Login failed, please try again later';
    }
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}

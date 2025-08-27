import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UserRole } from '../../../features/auth/auth.service';
import { Subscription, lastValueFrom } from 'rxjs';

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

  isLoggedIn: boolean = false;
  private sub!: Subscription;

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
      // 1️⃣ 登入
      await this.authService.login(this.email, this.password);

      // 2️⃣ 取得角色
      const role: UserRole = await lastValueFrom(this.authService.userRole$);

      // 3️⃣ 根據角色導向
      if (role === 'admin' || role === 'host') {
        this.router.navigate(['/profile']); // 管理員和房東頁面
      } 

      else {
        this.router.navigate(['/home']);     // 普通使用者
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message || 'Login failed, please try again later';
    }
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}

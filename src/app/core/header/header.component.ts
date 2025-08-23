import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { filter, take } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  language: 'en' | 'zh' = 'en';
  isSidebarOpen = false;
  isDarkText = false; // true → 黑字，false → 白字
  isLoggedIn = false;

  // 新增控制 My Flats 子選單
  flatsMenuOpen = false;
  ProfileMenuOpen = false;

  constructor(public authService: AuthService, private router: Router) {
    // 監聽登入狀態
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  // 語言切換
  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  // Sidebar 開關
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // 登出
  async logout() {
    await this.authService.logout();
    this.isSidebarOpen = false;
    this.flatsMenuOpen = false; // 登出時收起子選單
    this.ProfileMenuOpen = false; // 登出時收起子選單
  }

  // 點 Logo 登出
  async navigateToLogin() {
    await this.authService.logout();
    this.isSidebarOpen = false;
    this.flatsMenuOpen = false;
    this.ProfileMenuOpen = false;
  }

  // 檢查登入再導頁
  checkAuth(route: string) {
    this.authService.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([route]);
      } else {
        alert('Please register or log in first');
        this.router.navigate(['/login']);
      }
      this.isSidebarOpen = false;
      this.flatsMenuOpen = false; // 點其他按鈕也收起子選單
      this.ProfileMenuOpen = false;
    });
  }

  toggleFlatsMenu() {
    this.flatsMenuOpen = !this.flatsMenuOpen;
    if (this.flatsMenuOpen) this.ProfileMenuOpen = false;
  }
  
  toggleProfileMenu() {
    this.ProfileMenuOpen = !this.ProfileMenuOpen;
    if (this.ProfileMenuOpen) this.flatsMenuOpen = false;
  }

  // 直接導頁
  navigateTo(route: string) {
    this.router.navigate([route]);
    this.isSidebarOpen = false;
    this.flatsMenuOpen = false;
    this.ProfileMenuOpen = false;
  }

  ngAfterViewInit() {
    // 監聽路由變化
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const route = event.urlAfterRedirects;
        this.applyRouteColor(route);
      });

    // 初始化套用一次
    this.applyRouteColor(this.router.url);
  }

  private applyRouteColor(route: string) {
    switch(route) {
      case '/login':
        this.isDarkText = false; // 深色背景 → 白字
        break;
      case '/profile':
        this.isDarkText = true; // 淺色背景 → 黑字
        break;
      default:
        this.isDarkText = true;
    }
  }
}

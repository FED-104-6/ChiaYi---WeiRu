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

  constructor(public authService: AuthService, private router: Router) {
    // 監聽登入狀態
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  async logout() {
    await this.authService.logout(); // ✅ 等待完成
    this.isSidebarOpen = false;       // 收起 sidebar
  }

  async navigateToLogin() {
    await this.authService.logout();  // 點 logo 也登出
    this.isSidebarOpen = false;
  }

  checkAuth(route: string) {
    this.authService.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([route]);
      } else {
        alert('Please register or log in first');
        this.router.navigate(['/login']);
      }
      this.isSidebarOpen = false;
    });
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

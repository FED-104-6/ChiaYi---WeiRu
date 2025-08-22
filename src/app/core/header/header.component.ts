import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { filter } from 'rxjs/operators';
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

  constructor(public authService: AuthService, private router: Router) {}

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.toggleSidebar(); // 關閉選單
  }

  ngAfterViewInit() {
    // 監聽路由變化
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const route = event.urlAfterRedirects;
        this.applyRouteColor(route);
      });

    // 初始化時套用一次顏色
    this.applyRouteColor(this.router.url);
  }

  // 根據 route 設定 header 顏色
  private applyRouteColor(route: string) {
    switch(route) {
      case '/home':
        this.isDarkText = false; // 深色背景 → 白字
        break;
      case '/profile':
        this.isDarkText = true; // 淺色背景 → 黑字
        break;
      default:
        this.isDarkText = true; // 其他頁面淺色背景 → 黑字
    }
  }
}

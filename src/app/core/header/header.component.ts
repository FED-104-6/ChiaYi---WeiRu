import { Component, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  language: 'en' | 'zh' = 'en';
  isSidebarOpen = false;
  isDarkText = false;
  role: string | null = null; // admin / host / guest / null

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateRoleAndColor();

    // 監聽路由變化，更新角色及文字顏色
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateRoleAndColor());
  }

  // 語言切換
  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  // 右側側邊選單開關
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // 登出
  logout() {
    this.authService.logout();
    this.toggleSidebar();
    this.router.navigate(['/login']);
  }

  // 更新角色及文字顏色
  private updateRoleAndColor() {
    this.role = this.authService.currentUserRole();
    const route = this.router.url;

    // Header 文字顏色
    this.applyRouteColor(route);
  }

  // 根據路由改變文字顏色
  private applyRouteColor(route: string) {
    switch (route) {
      case '/home':
        this.isDarkText = false; // 白字
        break;
      default:
        this.isDarkText = true; // 黑字
    }
  }
}

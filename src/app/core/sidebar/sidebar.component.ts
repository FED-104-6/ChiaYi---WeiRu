import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit {
  language: 'en' | 'zh' = 'en';
  isSidebarOpen = false;
  isDarkText = false;
  isLoggedIn = false;

  flatsMenuOpen = false;
  profileMenuOpen = false;

  constructor(public authService: AuthService, private router: Router) {
    // 監聽登入狀態
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  /** 語言切換 */
  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  /** Sidebar 開關 */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /** 登出 */
  async logout() {
    await this.authService.logout();
    this.closeMenus();
    this.router.navigate(['/login']);
  }

  /** 點 Logo 回首頁 */
  async navigateToLogin() {
    await this.authService.logout();
    this.closeMenus();
    this.router.navigate(['/login']);
  }

  /** 導頁（需檢查登入） */
  checkAuth(route: string) {
    this.authService.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([route]);
      } else {
        alert('Please register or log in first');
        this.router.navigate(['/login']);
      }
      this.closeMenus();
    });
  }

  /** Flats 子選單切換 */
  toggleFlatsMenu() {
    this.flatsMenuOpen = !this.flatsMenuOpen;
    if (this.flatsMenuOpen) this.profileMenuOpen = false;
  }

  /** 直接導頁 */
  navigateTo(route: string) {
    this.router.navigate([route]);
    this.closeMenus();
  }

  /** 統一收合選單 */
  private closeMenus() {
    this.isSidebarOpen = false;
    this.flatsMenuOpen = false;
  }

  /** 監聽路由變化 */
  ngAfterViewInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.applyRouteColor(event.urlAfterRedirects);
      });

    this.applyRouteColor(this.router.url);
  }

  /** 根據路由切換 Sidebar 文字顏色 */
  private applyRouteColor(route: string) {
    const darkTextRoutes = ['/profile', '/update-profile', '/all-users', '/new-flat', '/view-flat'];
    this.isDarkText = darkTextRoutes.includes(route);
  }
}

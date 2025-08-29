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

  userRole: 'admin' | 'host' | 'guest' | null = null;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    this.authService.userRole$.subscribe(role => this.userRole = role);
  }

  /** 判斷是否顯示 Sidebar */
  get showSidebar(): boolean {
    return this.isLoggedIn && this.userRole != null && this.userRole !== 'guest';
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

  /** 點擊 Logo 回首頁 */
  navigateHome() {
    this.closeMenus();
    this.router.navigate(['/home']);
  }

  /** Profile 子選單切換 */
  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
    if (this.profileMenuOpen) this.flatsMenuOpen = false;
  }

  /** Flats 子選單切換 */
  toggleFlatsMenu() {
    this.flatsMenuOpen = !this.flatsMenuOpen;
    if (this.flatsMenuOpen) this.profileMenuOpen = false;
  }

  /** 直接導頁，支援可選參數 */
  navigateTo(route: string, params?: any[]) {
    if (params && params.length) {
      this.router.navigate([route, ...params]);
    } else {
      this.router.navigate([route]);
    }
    this.closeMenus();
  }

  /** 統一收合選單 */
  private closeMenus() {
    this.isSidebarOpen = false;
    this.flatsMenuOpen = false;
    this.profileMenuOpen = false;
  }

  /** 監聽路由變化，控制文字顏色 */
  ngAfterViewInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.applyRouteColor(event.urlAfterRedirects);
      });

    // 初始化文字顏色
    this.applyRouteColor(this.router.url);
  }

  /** 根據路由切換 Sidebar 文字顏色，支援 startsWith */
  private applyRouteColor(route: string) {
    const darkTextRoutes = [
      '/profile',
      '/update-profile',
      '/all-users',
      '/admin-view-flat',
      '/flats/new-flat',
      '/flats/view-flat',
      '/flats/edit-flat',
      '/flats/my-flats'
    ];
    this.isDarkText = darkTextRoutes.some(r => route.startsWith(r));
  }
}

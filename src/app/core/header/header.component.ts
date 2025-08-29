import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  language: 'en' | 'zh' = 'en';
  isOverlayMenuOpen = false;
  isDarkText = false;
  role: string | null = null; // admin / host / guest / null
  showLangSwitch = true;      // 是否顯示語言切換

  // 列出需要隱藏語言切換的路由（支持 startsWith 判斷）
  hideLangRoutes: string[] = [
    '/my-account',
    '/flats/new-flat',
    '/flats/view-flat',
    '/flats/favourites',
    '/my-messages'
  ];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateHeaderState();

    // 監聽路由變化，更新 header 狀態
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateHeaderState());
  }

  // 語言切換
  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  // 右側側邊選單開關
  toggleOverlayMenu() {
    this.isOverlayMenuOpen = !this.isOverlayMenuOpen;
  }

  // 登出
  logout() {
    this.authService.logout();
    this.toggleOverlayMenu();
    this.router.navigate(['/login']);
  }

  // 更新角色、文字顏色及語言切換
  private updateHeaderState() {
    let route = this.router.url;

    // 如果是根路徑 /，當作 /home
    if (route === '/') route = '/home';

    // 更新使用者角色
    this.role = this.authService.currentUserRole();

    // 更新文字顏色
    this.isDarkText = this.shouldUseDarkText(route);

    // 更新語言切換顯示
    this.showLangSwitch = !this.hideLangRoutes.some(path => route.startsWith(path));
  }

  // 根據路由判斷文字顏色
  private shouldUseDarkText(route: string): boolean {
    // 首頁白字，其餘黑字
    return route !== '/home';
  }
}

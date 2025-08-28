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
  role: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateRoleAndColor();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateRoleAndColor());
  }

  /** 語言切換 */
  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  /** sidebar 開關 */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /** 登出 */
  logout() {
    this.authService.logout();
    this.isSidebarOpen = false;
    this.router.navigate(['/login']);
  }

  /** 根據路由更新 role 與文字顏色 */
  private updateRoleAndColor() {
    this.role = this.authService.currentUserRole();
    const route = this.router.url;

    // dark text 路由判斷
    this.isDarkText =
      route.startsWith('/flats') ||
      ['/my-account', '/my-messages'].includes(route);
  }
}

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
  showHeader = true;

  // 想隱藏 header 的路由清單
  private hiddenHeaderRoutes: string[] = [
    '/all-users',
    '/login',
    '/register'
  ];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // 監聽路由變化
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const route = (event as NavigationEnd).urlAfterRedirects;
  
        // 套用顏色
        this.applyRouteColor(route);
  
        // 根據角色決定 header 是否顯示
        const role = this.authService.currentUserRole(); // admin / host / guest
        this.showHeader = !(role === 'admin' || role === 'host');
      });
  
    // 初始化一次
    const role = this.authService.currentUserRole();
    this.showHeader = !(role === 'admin' || role === 'host');
  
    const currentRoute = this.router.url;
    this.applyRouteColor(currentRoute);
  }  

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.toggleSidebar();
  }

  private applyRouteColor(route: string) {
    switch(route) {
      case '/home':
        this.isDarkText = false;
        break;
      case '/profile':
        this.isDarkText = true;
        break;
      default:
        this.isDarkText = true;
    }
  }
}

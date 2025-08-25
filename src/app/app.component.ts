import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { HeaderComponent } from './core/header/header.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  showHeader$!: Observable<boolean>;
  showSidebar$!: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router) {
    // 監聽路由變化
    const url$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    );

    // Header 顯示控制
    // 登入後都顯示 header，但可根據路由調整，例如 /login 或 /register 不顯示
    const hiddenHeaderRoutes = ['/login', '/register'];
    this.showHeader$ = combineLatest([this.authService.isLoggedIn$, url$]).pipe(
      map(([isLoggedIn, url]) => isLoggedIn && !hiddenHeaderRoutes.includes(url))
    );

    // Sidebar 顯示控制
    // 只在登入後且不是首頁 /home 時顯示
    this.showSidebar$ = combineLatest([this.authService.isLoggedIn$, url$]).pipe(
      map(([isLoggedIn, url]) => isLoggedIn && url !== '/home')
    );
  }
}

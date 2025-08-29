import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { HeaderComponent } from './core/header/header.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { AuthService, UserRole } from './features/auth/auth.service';

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
    const url$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    );

    // Header 顯示控制
    const hiddenHeaderRoutes = ['/login', '/register'];
    this.showHeader$ = combineLatest([this.authService.isLoggedIn$, this.authService.userRole$, url$]).pipe(
      map(([isLoggedIn, role, url]) => {
        if (role === 'admin' || role === 'host') return false;
        return isLoggedIn && !hiddenHeaderRoutes.includes(url);
      })
    );

    // Sidebar 顯示控制
    const hiddenSidebarRoutes = ['/home', '/login', '/register']; // 不顯示 sidebar 的頁面
    this.showSidebar$ = combineLatest([this.authService.isLoggedIn$, this.authService.userRole$, url$]).pipe(
      map(([isLoggedIn, role, url]) => {
        // 只顯示 sidebar 當已登入且不是 guest，且不在隱藏頁面
        return isLoggedIn && role !== 'guest' && !hiddenSidebarRoutes.includes(url);
      })
    );
  }
}

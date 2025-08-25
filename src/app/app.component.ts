import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../app/features/auth/auth.service';
import { HeaderComponent } from './core/header/header.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { filter, map, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  showHeader$!: Observable<boolean>;
  showSidebar$!: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router) {
    /** 監聽目前路由 (url$) */
    const url$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url) // 預設值避免剛載入時為空
    );

    /** Header 顯示邏輯：登入狀態且非 /all-users 頁面 */
    this.showHeader$ = combineLatest([
      this.authService.isLoggedIn$,
      url$
    ]).pipe(
      map(([isLoggedIn, url]) => {
        const noHeaderRoutes = ['/all-users', '/update-profile']; // Header 不顯示的路徑
        return isLoggedIn && !noHeaderRoutes.includes(url);
      })
    );

    /** Sidebar 顯示邏輯：登入狀態且在 /all-users 或 /update-profile 頁面 */
    this.showSidebar$ = combineLatest([
      this.authService.isLoggedIn$,
      url$
    ]).pipe(
      map(([isLoggedIn, url]) => {
        const sidebarRoutes = ['/all-users', '/update-profile']; // Sidebar 顯示的路徑
        return isLoggedIn && sidebarRoutes.includes(url);
      })
    );
  }
}

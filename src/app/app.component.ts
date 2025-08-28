import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { HeaderComponent } from './core/header/header.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { AuthService } from './features/auth/auth.service';

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
  templateUrl: './app.html',   // ✅ 建議用正確命名
  styleUrls: ['./app.css']     // ✅ 建議用正確命名
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
    this.showHeader$ = combineLatest([this.authService.isLoggedIn$, url$]).pipe(
      map(([isLoggedIn, url]) => isLoggedIn && !hiddenHeaderRoutes.includes(url))
    );

    // Sidebar 顯示控制
    this.showSidebar$ = combineLatest([this.authService.isLoggedIn$, url$]).pipe(
      map(([isLoggedIn, url]) => isLoggedIn && url !== '/home')
    );
  }
}

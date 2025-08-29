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
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  showHeader$!: Observable<boolean>;
  showSidebar$!: Observable<boolean>;
  guestBg$!: Observable<boolean>;

  sidebarCollapsed = false; // 控制右側 sidebar 摺疊

  constructor(public authService: AuthService, private router: Router) {
    const url$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    );

    const hiddenHeaderRoutes = ['/login', '/register'];
    this.showHeader$ = combineLatest([this.authService.isLoggedIn$, url$]).pipe(
      map(([isLoggedIn, url]) => isLoggedIn && !hiddenHeaderRoutes.includes(url))
    );

    this.showSidebar$ = combineLatest([this.authService.isLoggedIn$, url$]).pipe(
      map(([isLoggedIn, url]) => isLoggedIn && url !== '/home')
    );

    const guestRoutes = [
      '/flats/new-flat',
      '/flats/view-flat',
      '/flats/favourites',
      '/messages',
      '/host-messages'
    ];

    this.guestBg$ = combineLatest([this.authService.userRole$, url$]).pipe(
      map(([role, url]) => role === 'guest' && guestRoutes.some(r => url.startsWith(r)))
    );
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

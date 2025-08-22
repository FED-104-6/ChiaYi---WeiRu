import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../app/features/auth/auth.service';
import { HeaderComponent } from './core/header/header.component';
import { filter, map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  showHeader$!: Observable<boolean>;  // 用 ! 告訴 TS 會在 constructor 初始化

  constructor(public authService: AuthService, private router: Router) {
    this.showHeader$ = combineLatest([
      this.authService.isLoggedIn$,
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.url)
      )
    ]).pipe(
      map(([isLoggedIn, url]) => {
        const noHeaderRoutes = ['/login', '/register'];
        return isLoggedIn && !noHeaderRoutes.includes(url);
      })
    );
  }
}

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

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.isSidebarOpen = false;
    this.router.navigate(['/login']);
  }

  private updateRoleAndColor() {
    this.role = this.authService.currentUserRole();
    const route = this.router.url;
    const darkTextRoutes = ['/my-account', '/new-flat', '/view-flat', '/favorite', '/customer-view-messages'];
    this.isDarkText = darkTextRoutes.includes(route);
  }
}

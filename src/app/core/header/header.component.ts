import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  language: 'en' | 'zh' = 'en';
  isSidebarOpen = false;

  constructor(public authService: AuthService) {}

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.toggleSidebar(); // 關閉選單
  }
}
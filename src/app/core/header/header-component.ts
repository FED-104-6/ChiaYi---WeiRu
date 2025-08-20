import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent {
  authChecked = true; // ✅ 一開始就顯示 Login / Logout 區塊

  constructor(public authService: AuthService) {}

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  get userRole() {
    return this.authService.userRole;
  }

  logout() {
    this.authService.logout();
  }
}

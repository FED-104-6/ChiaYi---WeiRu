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
  constructor(public authService: AuthService) {}

  language: 'en' | 'zh' = 'en';

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  logout() {
    this.authService.logout();
  }
}

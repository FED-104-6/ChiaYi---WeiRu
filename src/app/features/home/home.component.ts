import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../core/header/header.component';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  language: 'en' | 'zh' = 'en';
  currentSlide = 5;
  totalSlides = 5;
  isPaused = false;

  constructor(public authService: AuthService) {}

  setLanguage(lang: 'en' | 'zh') {
    this.language = lang;
  }

  logout() {
    this.authService.logout();
  }
}

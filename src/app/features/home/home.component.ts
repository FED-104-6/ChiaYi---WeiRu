import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../core/header/header.component';
import { AuthService, UserRole } from '../../features/auth/auth.service';

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
export class HomeComponent implements OnInit {
  language: 'en' | 'zh' = 'en';
  currentSlide = 5;
  totalSlides = 5;
  isPaused = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 初始化時判斷角色
    const role: UserRole = this.authService.currentUserRole();
    if (role === 'admin') {
      this.router.navigate(['/profile']);
    }
  }

  setLanguage(lang: 'en' | 'zh'): void {
    this.language = lang;
  }

  logout(): void {
    this.authService.logout();
  }
}

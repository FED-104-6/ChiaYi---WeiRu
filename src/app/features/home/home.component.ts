import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { NewFlatComponent } from '../flats/new-flat/new-flat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NewFlatComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  language: 'en' | 'zh' = 'en';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  setLanguage(lang: 'en' | 'zh'): void {
    this.language = lang;
  }

  logout(): void {
    this.authService.logout();
  }
}
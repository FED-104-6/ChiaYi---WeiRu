import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,       // 讓 <router-outlet> 可以用
    HeaderComponent     // 讓 <app-header> 可以用
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  constructor(private router: Router) {}

  // 判斷當前路由是否是首頁
  get showHeader(): boolean {
    return this.router.url !== '/home';
  }
}

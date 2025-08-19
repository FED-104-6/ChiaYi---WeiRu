import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,   // 讓 <router-outlet> 可以用
    HeaderComponent // 讓 <app-header> 可以用
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}

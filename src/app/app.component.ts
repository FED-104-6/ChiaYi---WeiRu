import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <!-- 側邊欄 -->
      <nav [class.collapsed]="isCollapsed">
        <button class="toggle-btn" (click)="toggleSidebar()">
          {{ isCollapsed ? '▶' : '◀' }}
        </button>
        <ul>
          <li><a routerLink="/edit-flat">Edit flat</a></li>
          <li><a routerLink="/new-flat">New flat</a></li>
          <li><a routerLink="/favourites">Favourites</a></li>
          <li><a routerLink="/my-flats">My flats</a></li>
          <li><a routerLink="/search">Search</a></li>
          <li><a routerLink="/view-flat">View flat</a></li>
        </ul>
      </nav>

      <!-- 主要內容區 -->
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../features/auth/auth.service';

// 方法 A：擴充 UserRole 型別，包含 guest
export type UserRole = 'admin' | 'host' | 'guest';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userRole: UserRole | null = null;
  language: string = 'en';
  profileMenuOpen: boolean = false;
  flatsMenuOpen: boolean = false;
  private authSubscription: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🎯 Subscribe to both observables to get user status and role
    this.authSubscription.add(
      this.authService.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      })
    );

    this.authSubscription.add(
      this.authService.userRole$.subscribe(role => {
        this.userRole = role as UserRole; // 方法 A：確保 role 型別正確
      })
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMenus();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
    this.flatsMenuOpen = false;
  }

  toggleFlatsMenu(): void {
    this.flatsMenuOpen = !this.flatsMenuOpen;
    this.profileMenuOpen = false;
  }

  closeMenus(): void {
    this.profileMenuOpen = false;
    this.flatsMenuOpen = false;
  }

  setLanguage(lang: string): void {
    this.language = lang;
    console.log(`Language set to: ${this.language}`);
  }

  navigateHome(): void {
    this.router.navigate(['/home']);
  }

  // 方法 C：新增 getter 控制 Messages 顯示，避免 TS2367
  get showMessages(): boolean {
    return this.userRole === 'host' || this.userRole === 'guest';
  }

  get showAdminMessages(): boolean {
    return this.userRole === 'admin';
  }
}
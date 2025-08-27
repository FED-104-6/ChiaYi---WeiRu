import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, UserRole } from '../../features/auth/auth.service';

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
        this.userRole = role;
      })
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  // 🎯 Added all missing methods from the template
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
    // 💡 Close other menus
    this.flatsMenuOpen = false;
  }

  toggleFlatsMenu(): void {
    this.flatsMenuOpen = !this.flatsMenuOpen;
    // 💡 Close other menus
    this.profileMenuOpen = false;
  }

  // 🎯 The method you were missing
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
}
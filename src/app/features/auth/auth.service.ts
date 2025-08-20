import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  userRole: 'landlord' | 'tenant' | null = null;

  login(role: 'landlord' | 'tenant') {
    this.isLoggedIn = true;
    this.userRole = role;
  }

  logout() {
    this.isLoggedIn = false;
    this.userRole = null;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  userRole: 'landlord' | 'tenant' | null = null;

  // 改成接受 email + password，回傳 boolean
  login(email: string, password: string): boolean {
    // 模擬驗證
    if (email === 'tenant@test.com' && password === '1234') {
      this.isLoggedIn = true;
      this.userRole = 'tenant';
      return true;
    }
    if (email === 'landlord@test.com' && password === '1234') {
      this.isLoggedIn = true;
      this.userRole = 'landlord';
      return true;
    }
    // 登入失敗
    return false;
  }

  logout() {
    this.isLoggedIn = false;
    this.userRole = null;
  }
}

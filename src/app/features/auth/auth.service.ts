import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'admin' | 'host' | 'guest' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** 登入狀態 */
  private loggedIn = new BehaviorSubject<boolean>(false);
  /** 使用者角色 */
  private role = new BehaviorSubject<UserRole>(null);

  /** 外部可訂閱登入狀態 */
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  /** 外部可訂閱使用者角色 */
  userRole$: Observable<UserRole> = this.role.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  /** 取得當前使用者角色（同步） */
  currentUserRole(): UserRole {
    return this.role.getValue();
  }

  /** 註冊會員 */
  async register(
    fullname: string,
    email: string,
    password: string,
    country: string,
    phonenumber: string
  ): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullname });

      const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
      await setDoc(userRef, {
        fullname,
        email,
        country,
        phonenumber,
        role: 'guest', // 預設角色
      });

      this.loggedIn.next(true);
      this.role.next('guest');

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Register failed:', error);
      throw error;
    }
  }

  /** 登入會員 */
  async login(email: string, password: string): Promise<UserRole> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
      const userData = userDoc.data() as { role?: UserRole } | undefined;
      const userRole: UserRole = userData?.role || 'guest';

      this.loggedIn.next(true);
      this.role.next(userRole);

      // 根據角色導向不同頁面
      switch (userRole) {
        case 'admin':
          this.router.navigate(['/all-users']);
          break;
        case 'host':
          this.router.navigate(['/update-profile']);
          break;
        default:
          this.router.navigate(['/home']);
          break;
      }

      return userRole;

    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /** 登出會員 */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.loggedIn.next(false);
      this.role.next(null);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}

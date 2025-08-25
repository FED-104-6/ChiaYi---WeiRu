// src/app/features/auth/auth.service.ts
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
  // 登入狀態與角色
  private loggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<UserRole>(null);

  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  userRole$: Observable<UserRole> = this.role.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  /** 取得當前使用者角色 */
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
      // 1️⃣ Firebase Auth 建立帳號
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      // 2️⃣ 更新 displayName
      await updateProfile(userCredential.user, { displayName: fullname });

      // 3️⃣ 將額外資料存到 Firestore
      const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
      await setDoc(userRef, {
        fullname,
        email,
        country,
        phonenumber,
        role: 'guest', // 預設角色
      });

      // 4️⃣ 更新登入狀態
      this.loggedIn.next(true);
      this.role.next('guest');

      // 5️⃣ 導向首頁
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Register failed:', error);
      throw error;
    }
  }

  /** 登入會員 */
async login(email: string, password: string): Promise<UserRole> {
  try {
    // 1️⃣ Firebase Auth 登入
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const uid = userCredential.user.uid;

    // 2️⃣ 從 Firestore 取得使用者資料
    const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
    const userData = userDoc.data() as { role?: UserRole } | undefined;
    const userRole: UserRole = userData?.role || 'guest'; // 預設 guest

    // 3️⃣ 更新登入狀態
    this.loggedIn.next(true);
    this.role.next(userRole);

    // 4️⃣ 根據角色導向不同頁面
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

    // 5️⃣ 回傳角色給呼叫端（可選）
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

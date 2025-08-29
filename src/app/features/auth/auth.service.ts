import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { getDownloadURL, ref, uploadBytes, Storage } from '@angular/fire/storage';

export type UserRole = 'admin' | 'host' | 'guest' | null;

export interface AuthUser {
  uid?: string;
  displayName?: string;
  email?: string;
  role?: UserRole;
  photoURL?: string;
  avatarUrl?: string;
  phonenumber?: string; 
  country?: string;
  createdAt?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<UserRole>('guest');
  private user = new BehaviorSubject<AuthUser | null>(null);

  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  userRole$: Observable<UserRole> = this.role.asObservable();
  user$: Observable<AuthUser | null> = this.user.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private storage: Storage
  ) {}

  currentUserRole(): UserRole {
    return this.role.getValue();
  }

  currentUser(): AuthUser | null {
    return this.user.getValue();
  }

  /** ================== 註冊並寫入 Firestore ================== */
  async register(
    fullname: string,
    email: string,
    password: string,
    country: string,
    phonenumber: string,
    role: UserRole
  ): Promise<void> {
    try {
      // 建立 Firebase Auth 帳號
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;

      // 更新 displayName
      await updateProfile(firebaseUser, { displayName: fullname });

      // 在 Firestore 建立對應 users 文件
      const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      const userData: AuthUser = {
        uid: firebaseUser.uid,
        displayName: fullname,
        email,
        role,
        phonenumber,
        country,
        createdAt: new Date()
      };
      await setDoc(userRef, {
        fullname,
        email,
        password: '********', // 不存明碼
        country,
        phonenumber,
        role,
        createdAt: new Date(),
        profileImage: '' // 預設空
      });

      // 更新本地 state
      this.loggedIn.next(true);
      this.role.next(role);
      this.user.next(userData);

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Register failed:', error);
      throw error;
    }
  }

  /** ================== 登入 ================== */
  async login(email: string, password: string): Promise<UserRole> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
      const data = userDoc.data() as any;

      const userRole: UserRole = data?.role || 'guest';
      const userData: AuthUser = {
        uid,
        displayName: data?.fullname || userCredential.user.displayName || 'User',
        email: data?.email || email,
        role: userRole,
        phonenumber: data?.phonenumber || '',
        country: data?.country || '',
        avatarUrl: data?.profileImage || '',
        createdAt: data?.createdAt
      };

      this.loggedIn.next(true);
      this.role.next(userRole);
      this.user.next(userData);

      if (userRole === 'admin' || userRole === 'host') {
        this.router.navigate(['/profile']);
      } else {
        this.router.navigate(['/home']);
      }

      return userRole;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /** ================== 登出 ================== */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.loggedIn.next(false);
      this.role.next(null);
      this.user.next(null);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /** ================== 更新單一欄位 ================== */
  async updateProfileField(field: string, value: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No logged-in user');

      const userRef = doc(this.firestore, `users/${user.uid}`);
      const updateData: any = {};

      // 對應 Firestore 欄位
      switch (field) {
        case 'fullName':
          updateData.fullname = value;
          await updateProfile(user, { displayName: value });
          break;
        case 'phoneNumber':
          updateData.phonenumber = value;
          break;
        case 'email':
          updateData.email = value;
          break;
        case 'country':
          updateData.country = value;
          break;
        case 'password':
          console.warn('Password update not implemented yet.');
          break;
        default:
          updateData[field] = value;
          break;
      }

      await setDoc(userRef, updateData, { merge: true });

      // 更新本地 user state
      const currentUser = this.user.getValue();
      if (currentUser) {
        const updatedUser = { ...currentUser };
        if (field === 'fullName') updatedUser.displayName = value;
        if (field === 'email') updatedUser.email = value;
        if (field === 'phoneNumber') updatedUser.phonenumber = value;
        if (field === 'country') updatedUser.country = value;
        this.user.next(updatedUser);
      }
    } catch (error) {
      console.error('Update profile field failed:', error);
      throw error;
    }
  }

  /** ================== 上傳頭像 ================== */
  async uploadProfilePhoto(file: File): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No logged-in user');

    const storageRef = ref(this.storage, `avatars/${user.uid}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, { profileImage: downloadURL }, { merge: true });

    const currentUser = this.user.getValue();
    if (currentUser) {
      this.user.next({ ...currentUser, avatarUrl: downloadURL });
    }

    return downloadURL;
  }

  /** ================== Admin 取得所有用戶 ================== */
  getAllUsers(): Observable<AuthUser[]> {
    const usersRef = collection(this.firestore, 'users');
    return from(
      getDocs(usersRef).then(snapshot =>
        snapshot.docs.map(docSnap => {
          const data = docSnap.data() as any;
          return {
            uid: docSnap.id,
            displayName: data.fullname || '',
            email: data.email || '',
            role: data.role || 'guest',
            phonenumber: data.phonenumber || '',
            country: data.country || '',
            avatarUrl: data.profileImage || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
          } as AuthUser;
        })
      )
    );
  }
}

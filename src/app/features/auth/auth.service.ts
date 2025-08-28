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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<UserRole>(null);
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

  async register(
    fullname: string,
    email: string,
    password: string,
    country: string,
    phonenumber: string,
    role: UserRole
  ): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullname });

      const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
      const userData: AuthUser = {
        uid: userCredential.user.uid,
        displayName: fullname,
        email,
        role,
        phonenumber
      };
      await setDoc(userRef, {
        fullname,
        email,
        country,
        phonenumber,
        role,
        createdAt: new Date()
      });

      this.loggedIn.next(true);
      this.role.next(role);
      this.user.next(userData);

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Register failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserRole> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
      const userDataRaw = userDoc.data() as {
        fullname?: string;
        email?: string;
        role?: UserRole;
        phonenumber?: string;
      } | undefined;

      const userRole: UserRole = userDataRaw?.role || 'guest';
      const userData: AuthUser = {
        uid,
        displayName: userDataRaw?.fullname || userCredential.user.displayName || 'User',
        email: userDataRaw?.email || email,
        role: userRole,
        phonenumber: userDataRaw?.phonenumber || ''
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

  async updateProfileField(field: string, value: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No logged-in user');

      const userRef = doc(this.firestore, `users/${user.uid}`);
      const updateData: any = {};

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
        case 'password':
          console.warn('Password update not implemented yet.');
          break;
        default:
          updateData[field] = value;
          break;
      }

      await setDoc(userRef, updateData, { merge: true });

      const currentUser = this.user.getValue();
      if (currentUser) {
        const updatedUser = { ...currentUser };
        if (field === 'fullName') updatedUser.displayName = value;
        if (field === 'email') updatedUser.email = value;
        if (field === 'phoneNumber') updatedUser.phonenumber = value;
        this.user.next(updatedUser);
      }
    } catch (error) {
      console.error('Update profile field failed:', error);
      throw error;
    }
  }

  async uploadProfilePhoto(file: File): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No logged-in user');

    const storageRef = ref(this.storage, `avatars/${user.uid}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, { avatarUrl: downloadURL }, { merge: true });

    const currentUser = this.user.getValue();
    if (currentUser) {
      this.user.next({ ...currentUser, avatarUrl: downloadURL });
    }

    return downloadURL;
  }
}
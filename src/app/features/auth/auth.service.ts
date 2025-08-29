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
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc
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

export interface Message {
  id?: string;
  username: string;
  title: string;
  content: string;
  reply: string | null;
  status: 'replied' | 'unreplied';
  date: string;
  fromRole?: 'guest' | 'host' | 'admin';
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
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: fullname });

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
        password: '********',
        country,
        phonenumber,
        role,
        createdAt: new Date(),
        profileImage: ''
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

  /** ================== 新增 guest 留言（CustomerViewMessagesComponent） ================== */
  async sendGuestMessage(title: string, content: string): Promise<Message> {
    const currentUser = this.user.getValue();
    if (!currentUser) throw new Error('No logged-in user');

    const newMsg: Omit<Message, 'id'> = {
      username: currentUser.displayName || currentUser.email || 'Guest',
      title,
      content,
      reply: null,
      status: 'unreplied',
      date: new Date().toISOString(),
      fromRole: 'guest' // 標記為 guest 留言
    };

    const docRef = await addDoc(collection(this.firestore, 'questions'), newMsg);
    return { id: docRef.id, ...newMsg };
  }

  /** ================== Host 取得 CustomerViewMessagesComponent 的 guest 留言 ================== */
  async getGuestMessagesFromCustomerView(): Promise<Message[]> {
    const q = query(
      collection(this.firestore, 'questions'),
      where('fromRole', '==', 'guest')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data() as Omit<Message, 'id'> & { fromRole: string };
      return { id: docSnap.id, ...data };
    }).sort((a, b) => a.date < b.date ? 1 : -1);
  }

  /** ================== Host 回覆留言 ================== */
  async updateMessageReply(messageId: string, reply: string): Promise<void> {
    const messageRef = doc(this.firestore, `questions/${messageId}`);
    await updateDoc(messageRef, {
      reply,
      status: reply ? 'replied' : 'unreplied'
    });
  }

  /** ================== Host 刪除留言 ================== */
  async deleteMessage(messageId: string): Promise<void> {
    const messageRef = doc(this.firestore, `questions/${messageId}`);
    await deleteDoc(messageRef);
  }
}

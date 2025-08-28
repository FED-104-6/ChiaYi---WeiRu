import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../features/auth/auth.service';
import { NewFlatComponent } from '../flats/new-flat/new-flat.component';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

type Role = 'admin' | 'guest' | 'host';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NewFlatComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /** 語系切換 **/
  language: 'en' | 'zh' = 'en';

  /** 問題表單 **/
  showQuestionModal = false;
  questionTitle = '';
  questionContent = '';

  /** 使用者角色 (可從 AuthService 取得) **/
  role: Role = 'guest';

  constructor(
    public authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    // 從 AuthService 取得目前使用者
    const user = this.authService.currentUser(); // 注意要加括號呼叫方法
    if (user && user.role) {
      this.role = user.role as Role; // 直接轉型，支援 'admin'、'guest'、'host'
    }
  }  

  /** 切換語言 **/
  setLanguage(lang: 'en' | 'zh'): void {
    this.language = lang;
  }

  /** 登出 **/
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // ✅ 登出後導回登入頁
  }

  /** 開關提問視窗 **/
  toggleQuestionModal(): void {
    this.showQuestionModal = !this.showQuestionModal;
  }

  /** 提交提問 **/
  async submitQuestion(): Promise<void> {
    if (!this.questionTitle.trim() || !this.questionContent.trim()) {
      alert('Please fill in both fields');
      return;
    }

    const user = this.authService.currentUser();
    const username = user?.displayName || 'Guest';

    try {
      // 儲存到 Firestore 的 questions collection
      await addDoc(collection(this.firestore, 'questions'), {
        username,
        title: this.questionTitle,
        content: this.questionContent,
        reply: '',
        status: 'unreplied',
        date: new Date().toISOString().split('T')[0]
      });

      // 重置表單並關閉 Modal
      this.questionTitle = '';
      this.questionContent = '';
      this.showQuestionModal = false;
    } catch (error) {
      console.error('Failed to submit question:', error);
      alert('Failed to submit question. Please try again.');
    }
  }
}

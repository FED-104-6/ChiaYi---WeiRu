import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../features/auth/auth.service';
import { NewFlatComponent } from '../flats/new-flat/new-flat.component';

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
  role: 'guest' | 'host' = 'guest';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 如果 AuthService 有 role，可在這裡取得
    // this.role = this.authService.currentUserRole;
  }

  /** 切換語言 **/
  setLanguage(lang: 'en' | 'zh'): void {
    this.language = lang;
  }

  /** 登出 **/
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // ✅ 建議登出後導回登入頁
  }

  /** 開關提問視窗 **/
  toggleQuestionModal(): void {
    this.showQuestionModal = !this.showQuestionModal;
  }

  /** 提交提問 **/
  submitQuestion(): void {
    if (!this.questionTitle.trim() || !this.questionContent.trim()) {
      alert('Please fill in both fields');
      return;
    }

    console.log('Question Submitted:', {
      title: this.questionTitle,
      content: this.questionContent,
      role: this.role
    });

    // ✅ 這裡可改成呼叫 Firebase Firestore API
    // e.g., this.saveQuestionToFirestore({ title, content });

    // 重置表單並關閉 Modal
    this.questionTitle = '';
    this.questionContent = '';
    this.showQuestionModal = false;
  }
}

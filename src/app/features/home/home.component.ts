import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../features/auth/auth.service';
import { NewFlatComponent } from '../flats/new-flat/new-flat.component';
import { ViewFlatComponent } from '../flats/view-flat/view-flat.component';
import { FlatService } from '../../features/flats/flats.service';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

type Role = 'admin' | 'guest' | 'host';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NewFlatComponent,
    ViewFlatComponent
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

  /** 使用者角色 **/
  role: Role = 'guest';

  /** 搜尋關鍵字 **/
  searchKeyword = '';

  /** 取得 view-flat 元素的引用 */
  @ViewChild('viewFlatSection') viewFlatSection!: ElementRef;

  constructor(
    public authService: AuthService,
    private router: Router,
    private firestore: Firestore,
    private flatService: FlatService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && user.role) {
      this.role = user.role as Role;
    }
  }

  /** 切換語言 **/
  setLanguage(lang: 'en' | 'zh'): void {
    this.language = lang;
  }

  /** 登出 **/
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
      await addDoc(collection(this.firestore, 'questions'), {
        username,
        title: this.questionTitle,
        content: this.questionContent,
        reply: '',
        status: 'unreplied',
        date: new Date().toISOString().split('T')[0]
      });

      this.questionTitle = '';
      this.questionContent = '';
      this.showQuestionModal = false;
    } catch (error) {
      console.error('Failed to submit question:', error);
      alert('Failed to submit question. Please try again.');
    }
  }

  /** 搜尋 flats 並滾動到列表 */
  onSearch(): void {
    // 更新 flats 列表
    this.flatService.updateFlats(this.searchKeyword);

    // 延遲滾動，確保 ViewChild 可用
    setTimeout(() => {
      if (this.viewFlatSection) {
        this.viewFlatSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200); // 200ms 比較安全
  }
}

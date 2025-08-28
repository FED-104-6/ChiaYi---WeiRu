import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Message {
  id?: string;          // Firestore 文件 ID
  username: string;
  title: string;
  content: string;
  shortContent?: string;
  reply: string;
  status: 'replied' | 'unreplied';
  date: string;
}

@Component({
  selector: 'app-admin-view-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-view-messages.component.html',
  styleUrls: ['./admin-view-messages.component.css']
})
export class AdminViewMessagesComponent implements OnInit {
  messages: Message[] = [];
  pagedMessages: Message[] = [];

  filter = {
    startDate: '',
    endDate: '',
    status: ''
  };

  // 分頁控制
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // 編輯 Modal 控制
  editingMessage: Message | null = null;
  editingIndex: number = -1;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const colRef = collection(this.firestore, 'questions'); // ✅ guest 提問存 questions
    collectionData(colRef, { idField: 'id' }).subscribe((data: any[]) => {
      this.messages = data.map(q => {
        const content = q.content || ''; // ✅ 先定義 content
        return {
          id: q.id,
          username: q.username || 'Guest',
          title: q.title || '(No Title)',
          content,                         // 原始完整內容
          shortContent: this.getShortContent(content), // 縮短內容
          reply: q.reply || '',
          status: q.reply ? 'replied' : 'unreplied',
          date: q.date || new Date().toISOString().split('T')[0]
        };
      });
      this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
      this.setPagedMessages();
    });
  }

  /** 將 content 超過 10 個單字縮短 */
  getShortContent(content: string): string {
    const words = content.trim().split(/\s+/);
    if (words.length <= 10) return content;
    return words.slice(0, 10).join(' ') + '...';
  }

  /** 設定當前分頁資料 */
  setPagedMessages() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedMessages = this.messages.slice(start, end);
  }

  /** 下一頁 */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPagedMessages();
    }
  }

  /** 上一頁 */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPagedMessages();
    }
  }

  /** 套用篩選器 */
  applyFilter() {
    let filtered = [...this.messages];

    if (this.filter.startDate) {
      filtered = filtered.filter(msg => msg.date >= this.filter.startDate);
    }

    if (this.filter.endDate) {
      filtered = filtered.filter(msg => msg.date <= this.filter.endDate);
    }

    if (this.filter.status) {
      filtered = filtered.filter(msg => msg.status === this.filter.status);
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
    this.pagedMessages = filtered.slice(0, this.itemsPerPage);
  }

  /** 打開編輯 Modal */
  openEditModal(msg: Message, index: number) {
    this.editingMessage = { ...msg };
    this.editingIndex = index + (this.currentPage - 1) * this.itemsPerPage;
  }

  /** 保存編輯（更新 reply 與 status 到 Firestore） */
  async saveEdit() {
    if (this.editingMessage && this.editingMessage.id) {
      const docRef = doc(this.firestore, 'questions', this.editingMessage.id);
      await updateDoc(docRef, {
        reply: this.editingMessage.reply,
        status: this.editingMessage.reply ? 'replied' : 'unreplied'
      });

      // 本地也更新
      const idx = this.messages.findIndex(m => m.id === this.editingMessage!.id);
      if (idx !== -1) {
        this.messages[idx] = { ...this.editingMessage };
      }

      this.setPagedMessages();
      this.editingMessage = null;
      this.editingIndex = -1;
    }
  }

  /** 取消編輯 */
  cancelEdit() {
    this.editingMessage = null;
    this.editingIndex = -1;
  }

  /** 刪除訊息（Firestore 同步刪除） */
  async deleteMessage() {
    if (this.editingMessage?.id) {
      const docRef = doc(this.firestore, 'questions', this.editingMessage.id);
      await deleteDoc(docRef);

      this.messages = this.messages.filter(m => m.id !== this.editingMessage!.id);
      this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      this.setPagedMessages();
      this.cancelEdit();
    }
  }
}

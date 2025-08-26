import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  username: string;
  title: string;
  content: string;
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

  ngOnInit() {
    // 模擬假資料
    this.messages = Array.from({ length: 25 }, (_, i) => ({
      username: `User ${i + 1}`,
      title: `Title ${i + 1}`,
      content: `question ${i + 1}`,
      reply: `reply ${i + 1}`,
      status: i % 2 === 0 ? 'replied' : 'unreplied',
      date: `2025-08-${(i % 30 + 1).toString().padStart(2, '0')}`
    }));

    this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
    this.setPagedMessages();
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
    this.editingMessage = { ...msg }; // 深拷貝，避免直接修改原始資料
    this.editingIndex = index + (this.currentPage - 1) * this.itemsPerPage;
  }

  /** 保存編輯（只更新 reply 與 status） */
  saveEdit() {
    if (this.editingMessage && this.editingIndex >= 0) {
      const original = this.messages[this.editingIndex];
      this.messages[this.editingIndex] = {
        ...original,
        reply: this.editingMessage.reply,
        status: this.editingMessage.status
      };
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

  /** 刪除訊息 */
  deleteMessage() {
    if (this.editingIndex >= 0) {
      this.messages.splice(this.editingIndex, 1);
      this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      this.setPagedMessages();
      this.cancelEdit();
    }
  }
}

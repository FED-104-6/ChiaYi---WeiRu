import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Message } from '../../auth/auth.service';

@Component({
  selector: 'app-host-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host-messages.component.html',
  styleUrls: ['./host-messages.component.css']
})
export class HostMessagesComponent implements OnInit {
  messages: Message[] = [];
  pagedMessages: Message[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  editingMessage: Message | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadMessages();
  }

  /** 從 Firebase 讀取所有 guest 留言（只抓 CustomerViewMessagesComponent 送出的留言） */
  async loadMessages() {
    try {
      this.messages = await this.authService.getGuestMessagesFromCustomerView();
      this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
      this.setPagedMessages();
    } catch (error) {
      console.error('Failed to load guest messages:', error);
    }
  }

  /** 分頁 */
  setPagedMessages() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedMessages = this.messages.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPagedMessages();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPagedMessages();
    }
  }

  /** 開啟回覆 Modal */
  openReplyModal(msg: Message) {
    this.editingMessage = { ...msg };
  }

  /** 儲存回覆到 Firestore */
  async saveReply() {
    if (!this.editingMessage || !this.editingMessage.id) return;

    const index = this.messages.findIndex(m => m.id === this.editingMessage!.id);
    if (index < 0) return;

    try {
      await this.authService.updateMessageReply(this.editingMessage.id, this.editingMessage.reply || '');
      this.messages[index] = { ...this.messages[index], ...this.editingMessage };
      this.setPagedMessages();
      this.editingMessage = null;
    } catch (error) {
      console.error('Failed to save reply:', error);
    }
  }

  cancelReply() {
    this.editingMessage = null;
  }

  /** 刪除留言 */
  async deleteMessage(msg: Message) {
    if (!msg.id) return;

    try {
      await this.authService.deleteMessage(msg.id);
      this.messages = this.messages.filter(m => m.id !== msg.id);
      this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
      this.setPagedMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }

  /** 手動刷新留言 */
  async refreshMessages() {
    await this.loadMessages();
  }
}

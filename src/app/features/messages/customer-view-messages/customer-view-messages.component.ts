import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Message } from '../../auth/auth.service';

@Component({
  selector: 'app-customer-view-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-view-messages.component.html',
  styleUrls: ['./customer-view-messages.component.css']
})
export class CustomerViewMessagesComponent implements OnInit {
  myMessages: Message[] = [];
  newMessage = { title: '', content: '' };

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadMessages();
  }

  /** 從 Firebase 讀取該使用者的留言 */
  async loadMessages() {
    try {
      this.myMessages = await this.authService.getGuestMessagesFromCustomerView();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  /** 發送新留言 */
  async sendMessage() {
    const title = this.newMessage.title.trim();
    const content = this.newMessage.content.trim();
    if (!title || !content) return;

    try {
      // 使用 AuthService 的 sendGuestMessage 方法
      await this.authService.sendGuestMessage(title, content);

      // 重置表單
      this.newMessage.title = '';
      this.newMessage.content = '';

      // 重新載入留言列表
      await this.loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  /** 手動刷新留言列表（可選） */
  async refreshMessages() {
    await this.loadMessages();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Message {
  id: number;
  username: string;
  title: string;
  content: string;
  reply: string | null;
  status: 'replied' | 'unreplied';
  timestamp: Date;
}

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

  filter = { startDate: '', endDate: '', status: '' };
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  editingMessage: Message | null = null;

  ngOnInit() {
    // 假資料，模擬從後端取得訊息
    this.messages = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      username: `Guest ${i + 1}`,
      title: `Booking ${i + 1}`,
      content: `Question from guest ${i + 1}`,
      reply: i % 2 === 0 ? `Host reply ${i + 1}` : null,
      status: i % 2 === 0 ? 'replied' : 'unreplied',
      timestamp: new Date(2025, 7, (i % 30) + 1)
    }));
    this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
    this.setPagedMessages();
  }

  setPagedMessages() { 
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedMessages = this.messages.slice(start, end);
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.setPagedMessages(); } }
  prevPage() { if (this.currentPage > 1) { this.currentPage--; this.setPagedMessages(); } }

  applyFilter() {
    let filtered = [...this.messages];
    if (this.filter.startDate) filtered = filtered.filter(msg => new Date(msg.timestamp) >= new Date(this.filter.startDate));
    if (this.filter.endDate) filtered = filtered.filter(msg => new Date(msg.timestamp) <= new Date(this.filter.endDate));
    if (this.filter.status) filtered = filtered.filter(msg => msg.status === this.filter.status);

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
    this.pagedMessages = filtered.slice(0, this.itemsPerPage);
  }

  openReplyModal(msg: Message) {
    this.editingMessage = { ...msg };
  }

  saveReply() {
    if (this.editingMessage) {
      const index = this.messages.findIndex(m => m.id === this.editingMessage!.id);
      if (index >= 0) {
        this.messages[index] = {
          ...this.messages[index],
          reply: this.editingMessage.reply,
          status: this.editingMessage.reply ? 'replied' : 'unreplied'
        };
        this.setPagedMessages();
        this.editingMessage = null;
      }
    }
  }

  cancelReply() { this.editingMessage = null; }

  deleteMessage(msg: Message) {
    this.messages = this.messages.filter(m => m.id !== msg.id);
    this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.setPagedMessages();
  }
}

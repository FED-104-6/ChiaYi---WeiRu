import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

interface Message {
  id?: string; // Firestore document id
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

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  editingMessage: Message | null = null;
  editingIndex: number = -1;

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    await this.loadMessages();
  }

  /** 從 Firestore 讀取資料 */
  async loadMessages() {
    const querySnapshot = await getDocs(collection(this.firestore, 'questions'));
    this.messages = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data() as Omit<Message, 'id'>;
      return { id: docSnap.id, ...data };
    });

    this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
    this.setPagedMessages();
  }

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

  openEditModal(msg: Message, index: number) {
    this.editingMessage = { ...msg };
    this.editingIndex = index + (this.currentPage - 1) * this.itemsPerPage;
  }

  /** 保存編輯（更新 Firestore） */
  async saveEdit() {
    if (this.editingMessage && this.editingIndex >= 0) {
      const msg = this.messages[this.editingIndex];
      if (!msg.id) return;

      // 更新 Firestore
      await updateDoc(doc(this.firestore, 'questions', msg.id), {
        reply: this.editingMessage.reply,
        status: this.editingMessage.status
      });

      // 更新本地資料
      this.messages[this.editingIndex] = { ...msg, ...this.editingMessage };
      this.setPagedMessages();
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingMessage = null;
    this.editingIndex = -1;
  }

  /** 刪除 Firestore 訊息 */
  async deleteMessage() {
    const msg = this.messages[this.editingIndex];
    if (msg?.id) {
      await deleteDoc(doc(this.firestore, 'questions', msg.id));
      this.messages.splice(this.editingIndex, 1);
      this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
      this.setPagedMessages();
      this.cancelEdit();
    }
  }
}

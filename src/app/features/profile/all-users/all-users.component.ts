import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Role = 'host' | 'guest' | 'both';
export interface User {
  id: number;
  name: string;
  email: string;
  registeredAt: string | Date;
  role: Role;
}

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  // 篩選器
  filters = { startDate: null as string | null, endDate: null as string | null, role: 'all' as 'all' | Role };

  // 分頁
  pageSize = 10;
  currentPage = 1;

  // 使用者資料
  allUsers: User[] = [];
  filteredUsers: User[] = [];

  // Modal 狀態
  selectedUser: User | null = null;
  isModalOpen = false;

  ngOnInit(): void {
    // 模擬 50 位使用者
    this.allUsers = this.mockUsers(50);
    this.filteredUsers = [...this.allUsers];
  }

  // 模擬使用者資料
  mockUsers(count: number): User[] {
    const roles: Role[] = ['host', 'guest', 'both'];
    const today = new Date();
    const arr: User[] = [];
    for (let i = 1; i <= count; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - Math.floor(Math.random() * 365));
      arr.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        registeredAt: d.toISOString(),
        role: roles[i % 3],
      });
    }
    // 最新註冊的排在前面
    return arr.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  }

  // 篩選器
  applyFilters() {
    const start = this.filters.startDate ? new Date(this.filters.startDate) : null;
    const end = this.filters.endDate ? new Date(this.filters.endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    this.filteredUsers = this.allUsers.filter(u => {
      const t = new Date(u.registeredAt).getTime();
      const passStart = start ? t >= start.getTime() : true;
      const passEnd = end ? t <= end.getTime() : true;
      const passRole = this.filters.role === 'all' ? true : u.role === this.filters.role;
      return passStart && passEnd && passRole;
    });
    this.currentPage = 1;
  }

  // 分頁計算
  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  prevPage() { if(this.currentPage > 1) this.currentPage--; }
  nextPage() { if(this.currentPage < this.totalPages) this.currentPage++; }
  setPage(p: number) { if(p >= 1 && p <= this.totalPages) this.currentPage = p; }
  get totalPages() { return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize)); }

  // ===== Modal 方法 =====
  openModal(user: User) {
    // 複製一份 user 避免直接修改列表
    this.selectedUser = { ...user };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  saveUser() {
    if (!this.selectedUser) return;
    const index = this.allUsers.findIndex(u => u.id === this.selectedUser!.id);
    if (index !== -1) {
      this.allUsers[index] = { ...this.selectedUser };
      this.applyFilters(); // 更新列表
      this.closeModal();
    }
  }

  deleteUser(user: User) {
    const index = this.allUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.allUsers.splice(index, 1);
      this.applyFilters();
      this.closeModal();
    }
  }
}

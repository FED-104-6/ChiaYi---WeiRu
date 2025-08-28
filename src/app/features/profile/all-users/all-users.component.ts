import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../features/auth/auth.service'; // <-- 調整為你的實際路徑

type Role = 'admin' | 'host' | 'guest' ;
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // 從 Firebase 抓所有註冊用戶，並映射成本元件的 User 型別
    this.authService.getAllUsers().subscribe(rawUsers => {
      // 先把 Firebase 欄位 -> 本地欄位
      const mapped: User[] = rawUsers.map((u, i) => {
        // 角色對應：後端可能有 'admin'|'host'|'guest'|null
        // 你的 UI 僅有 'host'|'guest'|'both'，這裡把 'admin' 視為 'host'，null 視為 'guest'
        const role: Role =
          u.role === 'guest' ? 'guest'
          : u.role === 'host' ? 'host'
          : u.role === 'admin' ? 'admin'
          : 'guest'; // 其他不認得的值，預設當作 guest

        // createdAt 可能是 Date 或 Firestore Timestamp，這裡統一轉成 Date
        const reg =
          (u as any)?.createdAt?.toDate ? (u as any).createdAt.toDate()
          : u.createdAt ? new Date(u.createdAt as any)
          : new Date();

        return {
          id: i + 1, // 本地用流水號作為列表用的 id（不影響後端）
          name: u.displayName || 'User',
          email: u.email || '',
          registeredAt: reg,
          role
        };
      });

      // 依註冊時間新到舊排序，並重排 id
      const sorted = mapped.sort(
        (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
      ).map((u, idx) => ({ ...u, id: idx + 1 }));

      this.allUsers = sorted;
      this.filteredUsers = [...this.allUsers];
    });
  }

  // ===== 以下皆維持原本功能 =====

  // 模擬使用者資料（已不使用，但保留程式架構）
  mockUsers(count: number): User[] {
    const roles: Role[] = ['admin', 'host', 'guest'];
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

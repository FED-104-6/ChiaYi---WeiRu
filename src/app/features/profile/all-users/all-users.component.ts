import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Role = 'host' | 'guest' | 'both';
interface User {
  id: number;
  name: string;
  email: string;
  registeredAt: string | Date;
  role: Role;
  isAdmin?: boolean; // 新增管理員判斷
}

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  // ===== 篩選條件 =====
  filters: {
    startDate: string | null;
    endDate: string | null;
    role: 'all' | Role;
  } = {
    startDate: null,
    endDate: null,
    role: 'all'
  };

  // ===== 分頁 =====
  pageSize = 10;
  currentPage = 1;

  // ===== 資料 =====
  allUsers: User[] = [];
  filteredUsers: User[] = [];

  ngOnInit(): void {
    // Demo：可替換成 API 取得
    this.allUsers = this.mockUsers(87);
    // 初始顯示（不套用篩選）
    this.filteredUsers = [...this.allUsers];
  }

  // 產生假資料
  private mockUsers(count: number): User[] {
    const roles: Role[] = ['host', 'guest', 'both'];
    const arr: User[] = [];
    const today = new Date();
    for (let i = 1; i <= count; i++) {
      const daysAgo = Math.floor(Math.random() * 365); // 過去一年內
      const d = new Date(today);
      d.setDate(today.getDate() - daysAgo);

      arr.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        registeredAt: d.toISOString(),
        role: roles[i % roles.length],
        isAdmin: i === 1 // 假設第一個用戶是管理員
      });
    }

    // 依時間新到舊排序（可依需求）
    return arr.sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );
  }

  // 套用篩選（點擊「搜尋」）
  applyFilters(): void {
    const { startDate, endDate, role } = this.filters;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    this.filteredUsers = this.allUsers.filter(u => {
      const t = new Date(u.registeredAt).getTime();
      const passStart = start ? t >= start.getTime() : true;
      const passEnd = end ? t <= end.getTime() : true;
      const passRole =
        role === 'all'
          ? true
          : u.role === role;
      return passStart && passEnd && passRole;
    });

    // 篩選後回到第一頁
    this.currentPage = 1;
  }

  // 顯示中的分頁資料
  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  // 總頁數
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  // 分頁號碼（簡易版：全部列出；量大可做 windowing）
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  prevPage(): void {
    this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  // 顯示用：身份文字
  roleLabel(role: Role): string {
    switch (role) {
      case 'host':
        return 'Host';
      case 'guest':
        return 'Guest';
      case 'both':
        return 'Both';
    }
  }

  // 顯示用：日期格式 yyyy-mm-dd
  formatDate(d: string | Date): string {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // 修改角色
  updateUserRole(user: User): void {
    console.log(`User ${user.name} role changed to: ${user.role}`);
  
  // TODO: 如果你有 Firestore，可以在這裡更新資料庫
  // const userRef = doc(this.firestore, `users/${user.id}`);
  // await updateDoc(userRef, { role: user.role });
}

}

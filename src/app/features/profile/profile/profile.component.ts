import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  name: string = 'Name';
  photo: string | null = null;
  initials = 'U';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // ✅ 直接從 AuthService 取得使用者資料
    const user: AuthUser | null = this.authService.currentUser();
    if (user) {
      this.name = this.getNameByRole(user);
      this.photo = user.photoURL || user.avatarUrl || null;
    }

    this.initials = this.computeInitials(this.name);
  }

  /** 根據角色決定顯示名稱 */
  private getNameByRole(user: AuthUser): string {
    switch (user.role) {
      case 'host':
        return user.displayName || '房東';
      case 'guest':
        return user.displayName || '房客';
      case 'admin':
        return user.displayName || '管理者';
      default:
        return user.displayName || 'User';
    }
  }

  /** 產生縮寫：中文取第一字；英文取名字與姓氏首字母 */
  private computeInitials(name: string): string {
    if (!name) return 'U';
    const hasCJK = /[\u3400-\u9FFF]/.test(name);
    if (hasCJK) return name.trim().charAt(0).toUpperCase();

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}

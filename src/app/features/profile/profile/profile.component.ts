import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  /** 可用 @Input 傳入或由 localStorage 讀取 */
  @Input() name: string = 'Name';
  @Input() photo: string | null = null;

  initials = 'U';

  ngOnInit(): void {
    // 嘗試從 localStorage 讀取登入者資料
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) {
        const user = JSON.parse(raw) as { displayName?: string; name?: string; photoURL?: string; avatarUrl?: string };
        this.name = user.displayName || user.name || this.name;
        this.photo = (user.photoURL || user.avatarUrl || this.photo) ?? null;
      }
    } catch {
      // 解析錯誤就忽略，使用預設
    }

    this.initials = this.computeInitials(this.name);
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

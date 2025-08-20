import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showLogin = false;

  ngOnInit() {
    // 進入畫面就顯示浮層
    setTimeout(() => {
      this.showLogin = true;
    }, 50); // 延遲 50ms 觸發動畫
  }
}

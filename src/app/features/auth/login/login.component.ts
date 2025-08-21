import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showLogin: boolean = false; // ✅ 明確宣告

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 進入畫面就顯示浮層
    setTimeout(() => {
      this.showLogin = true;
    }, 50);
  }

  onLogin(): void {
    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = '帳號或密碼錯誤';
    }
  }
}

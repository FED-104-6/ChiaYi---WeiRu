import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // 🎯 匯入 RouterModule
import { routes } from './app/app.routes'; // 🎯 匯入你的路由配置
import { AppComponent } from './app/app.component'; // 🎯 匯入根元件

bootstrapApplication(AppComponent, {
  providers: [
    // 🎯 啟用路由
    importProvidersFrom(RouterModule.forRoot(routes)),
    // 🎯 啟用表單模組
    importProvidersFrom(FormsModule)
  ]
});
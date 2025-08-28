import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';  // ✅ 新增 import

// 直接在這裡寫 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyB0fRMrBtYgfnSFxjRgrIm8pBMZf7j5kF8",
  authDomain: "tasksproject-0931.firebaseapp.com",
  projectId: "tasksproject-0931",
  storageBucket: "tasksproject-0931.appspot.com",
  messagingSenderId: "510122616352",
  appId: "1:510122616352:web:cc81009c464c3d738bfe45"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())   // ✅ 新增 provider
  ]
});

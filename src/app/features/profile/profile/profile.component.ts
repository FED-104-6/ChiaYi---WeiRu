import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileSections = [
    { icon: '🌐', text: "Languages I speak" },
    { icon: '🗺️', text: 'Where I live' },
    { icon: '📍', text: 'Where I want to go' }
  ];
}

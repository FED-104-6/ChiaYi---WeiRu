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
    { icon: '🌐', text: "Where I've always wanted to go" },
    { icon: '💼', text: 'My work' },
    { icon: '🎵', text: 'My favourite song in high school' }
  ];
}

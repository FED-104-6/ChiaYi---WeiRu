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
    {
      title: 'Manage account',
      items: [
        { icon: '👤', text: 'Personal details' },
        { icon: '🌐', text: 'Languages' }
      ]
    },
    {
      title: 'Payment info',
      items: [
        { icon: '💰', text: 'Rewards & Wallet' },
        { icon: '💳', text: 'Payment methods' }
      ]
    },
    {
      title: 'Travel activity',
      items: [
        { icon: '✈️', text: 'Trips' }
      ]
    }  
  ];
}

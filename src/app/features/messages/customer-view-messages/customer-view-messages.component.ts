import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  title: string;
  content: string;
  reply: string | null;
  status: 'replied' | 'unreplied';
  timestamp: Date;
}

@Component({
  selector: 'app-customer-view-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-view-messages.component.html',
  styleUrls: ['./customer-view-messages.component.css']
})
export class CustomerViewMessagesComponent implements OnInit {
  myMessages: Message[] = [];
  newMessage = {
    title: '',
    content: ''
  };

  ngOnInit() {
    // Simulating fetching messages for the current user from a service
    this.myMessages = [
      {
        title: 'About a booking',
        content: 'I have a question about my booking for flat #123, please help.',
        reply: 'We have received your message and are currently processing it. We will get back to you as soon as possible.',
        status: 'replied',
        timestamp: new Date()
      },
      {
        title: 'Seeking help with login',
        content: 'I can\'t log into my account, what should I do?',
        reply: null,
        status: 'unreplied',
        timestamp: new Date()
      }
    ];
  }

  /** Sends a new message to the admin */
  sendMessage() {
    if (this.newMessage.title && this.newMessage.content) {
      // This is where you would call a service to send the new message to the backend
      console.log('Sending message:', this.newMessage);

      // Simulating adding the new message to the list
      const sentMessage: Message = {
        title: this.newMessage.title,
        content: this.newMessage.content,
        reply: null,
        status: 'unreplied', // New messages are initially marked as unreplied
        timestamp: new Date()
      };
      this.myMessages.unshift(sentMessage); // Add to the top of the list

      // Reset the form
      this.newMessage.title = '';
      this.newMessage.content = '';
    }
  }
}
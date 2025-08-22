import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFlatComponent } from '../view-flat/view-flat.component';

@Component({
  selector: 'app-my-flats',
  standalone: true,
  imports: [CommonModule, ViewFlatComponent],
  templateUrl: './my-flats.component.html',
  styleUrls: ['./my-flats.component.scss']
})
export class MyFlatsComponent {
  flats = [
    { name: 'Flat A', price: 1000, beds: 2, description: 'Nice flat' },
    { name: 'Flat B', price: 1500, beds: 3, description: 'Spacious flat' }
  ];
}

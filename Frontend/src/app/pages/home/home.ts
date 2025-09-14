import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  // Simple component for beautiful home page
  
  constructor() { }
  
  ngOnInit(): void {
    // Add any initialization logic here if needed
  }
}
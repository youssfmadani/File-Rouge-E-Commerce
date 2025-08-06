import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart {
  cartItems = [
    // Example data, replace with your actual cart logic
    { name: 'Product 1', price: 100, quantity: 2, imageUrl: 'https://via.placeholder.com/80' },
    { name: 'Product 2', price: 50, quantity: 1, imageUrl: 'https://via.placeholder.com/80' }
  ];

  get cartTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ProductCardComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  cartItems: any[] = [
    {
      name: 'Premium Wireless Headphones',
      price: 199.99,
      originalPrice: 249.99,
      category: 'Electronics',
      quantity: 1,
      image: 'https://via.placeholder.com/300x300/4285f4/ffffff?text=Headphones'
    },
    {
      name: 'Smart Fitness Watch',
      price: 149.99,
      category: 'Electronics',
      quantity: 2,
      image: 'https://via.placeholder.com/300x300/34a853/ffffff?text=Watch'
    },
    {
      name: 'Designer Backpack',
      price: 89.99,
      category: 'Fashion',
      quantity: 1,
      image: 'https://via.placeholder.com/300x300/ea4335/ffffff?text=Backpack'
    }
  ];

  recommendedProducts: any[] = [
    {
      name: 'Bluetooth Speaker',
      price: 79.99,
      category: 'Electronics',
      rating: 4.2,
      reviewCount: 56,
      image: 'https://via.placeholder.com/300x300/34a853/ffffff?text=Speaker'
    },
    {
      name: 'Wireless Earbuds',
      price: 59.99,
      category: 'Electronics',
      rating: 4.3,
      reviewCount: 42,
      image: 'https://via.placeholder.com/300x300/fbbc05/ffffff?text=Earbuds'
    },
    {
      name: 'Phone Case',
      price: 19.99,
      category: 'Accessories',
      rating: 4.1,
      reviewCount: 28,
      image: 'https://via.placeholder.com/300x300/ea4335/ffffff?text=Case'
    }
  ];

  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  clearCart() {
    this.cartItems = [];
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() > 100 ? 0 : 9.99;
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getDiscount(): number {
    return 0; // No discount applied
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTax() - this.getDiscount();
  }

  proceedToCheckout() {
    console.log('Proceeding to checkout with total:', this.getTotal());
  }
}

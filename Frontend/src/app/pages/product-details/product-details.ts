import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ProductCardComponent],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
  product: any = {
    name: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: 'Electronics',
    rating: 4.5,
    reviewCount: 128,
    description: 'High-quality wireless headphones with noise cancellation technology.',
    image: 'https://via.placeholder.com/500x500/4285f4/ffffff?text=Headphones'
  };

  quantity: number = 1;
  relatedProducts: any[] = [
    {
      name: 'Bluetooth Speaker',
      price: 89.99,
      category: 'Electronics',
      rating: 4.2,
      reviewCount: 56,
      image: 'https://via.placeholder.com/300x300/34a853/ffffff?text=Speaker'
    },
    {
      name: 'Smart Watch',
      price: 149.99,
      category: 'Electronics',
      rating: 4.7,
      reviewCount: 89,
      image: 'https://via.placeholder.com/300x300/ea4335/ffffff?text=Watch'
    },
    {
      name: 'Wireless Earbuds',
      price: 79.99,
      category: 'Electronics',
      rating: 4.3,
      reviewCount: 42,
      image: 'https://via.placeholder.com/300x300/fbbc05/ffffff?text=Earbuds'
    }
  ];

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateQuantity(event: any) {
    const value = parseInt(event.target.value);
    if (value > 0) {
      this.quantity = value;
    }
  }

  addToCart() {
    console.log('Adding to cart:', this.product, 'Quantity:', this.quantity);
  }

  buyNow() {
    console.log('Buying now:', this.product, 'Quantity:', this.quantity);
  }

  addToWishlist() {
    console.log('Adding to wishlist:', this.product);
  }
}

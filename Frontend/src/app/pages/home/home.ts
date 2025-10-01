import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];
  email: string = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    
    // Fetch products from the backend
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        // Take the first 4 products as featured
        this.featuredProducts = products.slice(0, 4);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading featured products:', error);
        this.loading = false;
      }
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  addToCart(product: Product): void {
    try {
      this.cartService.addToCart(product, 1);
      const productName = product.title || product.nom || product.name || 'Product';
      alert(`${productName} added to cart successfully!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  }

  getStarArray(rating: number): number[] {
    if (!rating || rating <= 0) return [0, 0, 0, 0, 0];
    return Array(5).fill(0).map((_, index) => index < Math.floor(rating) ? 1 : 0);
  }

  getDiscountPercent(originalPrice: number, currentPrice: number): number {
    if (originalPrice && currentPrice !== undefined && originalPrice > currentPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  }

  subscribeToNewsletter(): void {
    if (this.email && this.isValidEmail(this.email)) {
      // In a real application, you would send this to your backend
      console.log('Subscribing email:', this.email);
      alert('Thank you for subscribing to our newsletter!');
      this.email = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
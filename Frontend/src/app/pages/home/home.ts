import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];
  testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Regular Customer',
      content: 'The quality of products here is unmatched. Fast delivery and excellent customer service!',
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Premium Member',
      content: 'I\'ve been shopping here for years. Their selection and prices are unbeatable.',
      rating: 5
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Business Owner',
      content: 'Reliable service and consistent quality. My go-to store for all my needs.',
      rating: 4
    }
  ];

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.featuredProducts = products.slice(0, 6);
      },
      error: (error: any) => {
      }
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  getDiscountPercent(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  getRandomTestimonial() {
    return this.testimonials[Math.floor(Math.random() * this.testimonials.length)];
  }
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, SlicePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  @Input() product: any;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Output() addToCart = new EventEmitter<any>();
  @Output() addToWishlist = new EventEmitter<any>();
  @Output() addToCompare = new EventEmitter<any>();
  @Output() buyNow = new EventEmitter<any>();

  showQuickView = false;

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onAddToWishlist() {
    this.addToWishlist.emit(this.product);
  }

  onAddToCompare() {
    this.addToCompare.emit(this.product);
  }

  onBuyNow() {
    this.buyNow.emit(this.product);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < Math.floor(rating) ? 1 : 0);
  }

  getFullStars(rating: number): string {
    const fullStars = Math.floor(rating);
    return '★'.repeat(fullStars);
  }

  getEmptyStars(rating: number): string {
    const emptyStars = 5 - Math.floor(rating);
    return '☆'.repeat(emptyStars);
  }

  openQuickView() {
    this.showQuickView = true;
  }

  closeQuickView() {
    this.showQuickView = false;
  }

  // New methods for enhanced product card
  getDiscountPercent(): number {
    if (this.product?.originalPrice && this.product?.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return this.product?.discount || 0;
  }

  getSavingsAmount(): number {
    if (this.product?.originalPrice && this.product?.price) {
      return this.product.originalPrice - this.product.price;
    }
    return 0;
  }

  isInStock(): boolean {
    if (this.product?.stock !== undefined) {
      return this.product.stock > 0;
    }
    return this.product?.inStock !== false;
  }

  isLowStock(): boolean {
    if (this.product?.stock !== undefined) {
      return this.product.stock > 0 && this.product.stock <= 10;
    }
    return false;
  }

  isOutOfStock(): boolean {
    if (this.product?.stock !== undefined) {
      return this.product.stock <= 0;
    }
    return this.product?.inStock === false;
  }

  getAvailabilityText(): string {
    if (this.isOutOfStock()) {
      return 'Out of Stock';
    } else if (this.isLowStock()) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
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
}
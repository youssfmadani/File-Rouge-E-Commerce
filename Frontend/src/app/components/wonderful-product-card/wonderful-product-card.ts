import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wonderful-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wonderful-product-card.html',
  styleUrls: ['./wonderful-product-card.css']
})
export class WonderfulProductCardComponent {
  @Input() product: any;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Output() addToCart = new EventEmitter<any>();
  @Output() addToWishlist = new EventEmitter<any>();
  @Output() addToCompare = new EventEmitter<any>();
  @Output() buyNow = new EventEmitter<any>();

  showQuickView = false;
  quantity = 1;

  constructor(private router: Router) {}

  // Product Data Access Methods
  getProductImage(): string {
    return this.product?.imageUrl || this.product?.image || null; // Removed fallback image
  }

  getProductTitle(): string {
    return this.product?.name || this.product?.title || 'Premium Product';
  }

  getProductPrice(): number {
    return this.product?.price || 0;
  }

  getOriginalPrice(): number {
    return this.product?.originalPrice || this.product?.price || 0;
  }

  getProductRating(): number {
    return this.product?.rating || 0;
  }

  getProductCategory(): string {
    return this.product?.category || 'Electronics';
  }

  getProductDescription(): string {
    return this.product?.description || 'Premium quality product with excellent features and design.';
  }

  getReviewCount(): number {
    return this.product?.reviewCount || 0;
  }

  // Product Methods
  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < Math.floor(rating) ? 1 : 0);
  }

  getDiscountPercent(): number {
    if (this.getOriginalPrice() && this.getProductPrice()) {
      return Math.round(((this.getOriginalPrice() - this.getProductPrice()) / this.getOriginalPrice()) * 100);
    }
    return 0;
  }

  hasDiscount(): boolean {
    return this.getOriginalPrice() > this.getProductPrice();
  }

  isInStock(): boolean {
    return this.product?.inStock !== false;
  }

  isOutOfStock(): boolean {
    return !this.isInStock();
  }

  // Quantity Methods
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  // Quick View Methods
  closeQuickView(): void {
    this.showQuickView = false;
  }

  openQuickView(): void {
    this.showQuickView = true;
  }

  // Event Handlers
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

  viewProductDetails() {
    if (this.product?.id) {
      this.router.navigate(['/products', this.product.id]);
    }
  }
}
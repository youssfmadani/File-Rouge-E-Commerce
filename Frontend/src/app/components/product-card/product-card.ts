import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  selectedColor = 'default';
  selectedSize = 'default';
  quantity = 1;

  // Product options
  availableColors = [
    { name: 'default', label: 'Default', code: '#6366f1' },
    { name: 'black', label: 'Black', code: '#000000' },
    { name: 'white', label: 'White', code: '#ffffff' },
    { name: 'red', label: 'Red', code: '#ef4444' },
    { name: 'blue', label: 'Blue', code: '#3b82f6' }
  ];

  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  constructor(private router: Router) {}

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

  // Color and size selection
  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  // Quantity controls
  increaseQuantity() {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateQuantity(event: any) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      this.quantity = value;
    }
  }

  // New methods for enhanced product card
  getDiscountPercent(): number {
    if (this.product && this.product['originalPrice'] && this.product['price']) {
      return Math.round(((this.product['originalPrice'] - this.product['price']) / this.product['originalPrice']) * 100);
    }
    return this.product && this.product['discount'] || 0;
  }

  getSavingsAmount(): number {
    if (this.product && this.product['originalPrice'] && this.product['price']) {
      return this.product['originalPrice'] - this.product['price'];
    }
    return 0;
  }

  hasDiscount(): boolean {
    if (this.product && this.product['originalPrice'] && this.product['price']) {
      return this.product['originalPrice'] > this.product['price'];
    }
    return false;
  }

  isInStock(): boolean {
    if (this.product && this.product['stock'] !== undefined) {
      return this.product['stock'] > 0;
    }
    return this.product && this.product['inStock'] !== false;
  }

  isLowStock(): boolean {
    if (this.product && this.product['stock'] !== undefined) {
      return this.product['stock'] > 0 && this.product['stock'] <= 10;
    }
    return false;
  }

  isOutOfStock(): boolean {
    if (this.product && this.product['stock'] !== undefined) {
      return this.product['stock'] <= 0;
    }
    return this.product && this.product['inStock'] === false;
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

  // Navigation
  viewProductDetails() {
    const productId = (this.product && this.product['id']) || (this.product && this.product['idProduit']);
    if (productId) {
      this.router.navigate(['/products', productId]);
    }
  }

  // Get product image with fallback
  getProductImage(): string {
    return (this.product && this.product['imageUrl']) || 
           (this.product && this.product['image']) || 
           '';
  }

  // Get product title with fallback
  getProductTitle(): string {
    return (this.product && this.product['name']) || 
           (this.product && this.product['title']) || 
           (this.product && this.product['nom']) ||
           'Premium Product';
  }

  // Get product category with fallback
  getProductCategory(): string {
    return (this.product && this.product['category']) || 
           (this.product && this.product['categorie'] && this.product['categorie']['nom']) || 
           'Uncategorized';
  }

  // Get product price with fallback
  getProductPrice(): number {
    return (this.product && this.product['price']) || (this.product && this.product['prix']) || 0;
  }

  // Get original price with fallback
  getOriginalPrice(): number {
    return (this.product && this.product['originalPrice']) || (this.product && this.product['price']) || 0;
  }

  // Get product rating with fallback
  getProductRating(): number {
    return (this.product && this.product['rating']) || 0;
  }

  // Get review count with fallback
  getReviewCount(): number {
    return (this.product && this.product['reviewCount']) || 0;
  }

  // Get product brand with fallback
  getProductBrand(): string {
    return (this.product && this.product['brand']) || 'Unknown Brand';
  }

  // Get product description with fallback
  getProductDescription(): string {
    return (this.product && this.product['description']) || 'No description available for this product.';
  }

  // Get product features
  getProductFeatures(): string[] {
    return (this.product && this.product['features']) || [];
  }

  // Get product SKU
  getProductSKU(): string {
    return (this.product && this.product['sku']) || 'N/A';
  }

  // Get stock quantity
  getStockQuantity(): number {
    return (this.product && this.product['stock']) || 0;
  }
}
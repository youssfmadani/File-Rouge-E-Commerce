import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = false;
  error = '';
  
  // Product options
  quantity: number = 1;
  selectedColor: string = 'black';
  selectedSize: string = 'M';
  selectedImageIndex: number = 0;
  
  // Available options
  availableColors = [
    { name: 'black', label: 'Black', code: '#000000' },
    { name: 'white', label: 'White', code: '#FFFFFF' },
    { name: 'blue', label: 'Blue', code: '#3B82F6' },
    { name: 'red', label: 'Red', code: '#EF4444' }
  ];
  
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Product images
  productImages = [
    'https://via.placeholder.com/500x500/4285f4/ffffff?text=Main',
    'https://via.placeholder.com/500x500/34a853/ffffff?text=Side',
    'https://via.placeholder.com/500x500/ea4335/ffffff?text=Back',
    'https://via.placeholder.com/500x500/fbbc05/ffffff?text=Detail'
  ];
  
  // Tab state
  activeTab: string = 'description';
  
  // Cart state
  isAddingToCart = false;
  addToCartSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(parseInt(productId));
      }
    });
  }

  loadProduct(productId: number): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadRelatedProducts();
        this.loading = false;
        console.log('Product loaded:', product);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product. Please try again.';
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(): void {
    if (!this.product) return;
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Get products from same category, excluding current product
        this.relatedProducts = products
          .filter(p => p.id !== this.product?.id && p['category'] === this.product?.['category'])
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  // Quantity methods
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateQuantity(event: any): void {
    const value = parseInt(event.target.value);
    if (value > 0) {
      this.quantity = value;
    } else {
      this.quantity = 1;
    }
  }

  // Color and size selection
  selectColor(color: string): void {
    this.selectedColor = color;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  // Image navigation
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  // Tab navigation
  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  // Cart actions
  addToCart(): void {
    if (!this.product) {
      console.error('No product selected');
      return;
    }

    this.isAddingToCart = true;
    
    try {
      this.cartService.addToCart(
        this.product, 
        this.quantity, 
        {
          color: this.selectedColor,
          size: this.selectedSize
        }
      );
      
      this.addToCartSuccess = true;
      console.log('Added to cart:', {
        product: this.product,
        quantity: this.quantity,
        color: this.selectedColor,
        size: this.selectedSize
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        this.addToCartSuccess = false;
      }, 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      this.isAddingToCart = false;
    }
  }

  buyNow(): void {
    if (!this.product) {
      console.error('No product selected');
      return;
    }

    // Add to cart first
    this.addToCart();
    
    // Navigate to cart/checkout
    setTimeout(() => {
      this.router.navigate(['/cart']);
    }, 500);
  }

  addToWishlist(): void {
    if (!this.product) {
      console.error('No product selected');
      return;
    }

    // TODO: Implement wishlist functionality
    console.log('Adding to wishlist:', this.product);
    alert('Wishlist functionality will be implemented soon!');
  }

  // Utility methods
  getDiscountPercentage(): number {
    if (!this.product || !this.product['originalPrice'] || !this.product.price) return 0;
    const discount = ((this.product['originalPrice'] - this.product.price) / this.product['originalPrice']) * 100;
    return Math.round(discount);
  }

  isInCart(): boolean {
    return this.product ? this.cartService.isInCart(this.product.id!) : false;
  }

  getCartItemCount(): number {
    return this.product ? this.cartService.getItemCount(this.product.id!) : 0;
  }

  getSelectedColorInfo() {
    return this.availableColors.find(c => c.name === this.selectedColor);
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isStarFilled(star: number): boolean {
    const rating = this.product?.['rating'] || 0;
    return star <= rating;
  }

  // Template helper methods to avoid optional chaining warnings
  getProductTitle(): string {
    return this.product?.title || 'Product';
  }

  getProductImage(): string {
    return this.productImages[this.selectedImageIndex] || this.product?.image || 'https://via.placeholder.com/500x500/4285f4/ffffff?text=Product';
  }

  getProductCategory(): string {
    return this.product?.['category'] || 'Product Category';
  }

  getProductRating(): number {
    return this.product?.['rating'] || 0;
  }

  getProductReviewCount(): number {
    return this.product?.['reviewCount'] || 0;
  }

  getProductPrice(): number {
    return this.product?.price || 0;
  }

  getProductDescription(): string {
    return this.product?.description || 'High-quality product with premium features and excellent performance. Perfect for everyday use and professional applications.';
  }

  getProductBrand(): string {
    return this.product?.['brand'] || 'Premium Brand';
  }

  getProductModel(): string {
    return this.product?.['model'] || 'Latest Model';
  }

  getProductWeight(): string {
    return this.product?.['weight'] || '1.2 kg';
  }

  getProductDimensions(): string {
    return this.product?.['dimensions'] || '25 x 15 x 8 cm';
  }

  hasOriginalPrice(): boolean {
    return !!(this.product?.['originalPrice'] && this.product?.price);
  }

  getSavingsAmount(): number {
    if (!this.hasOriginalPrice() || !this.product) return 0;
    const originalPrice = this.product['originalPrice'] as number;
    const currentPrice = this.product.price as number;
    return originalPrice - currentPrice;
  }

  getOriginalPrice(): number {
    return this.product?.['originalPrice'] as number || 0;
  }

  trackByProduct(index: number, product: Product): number {
    return product.id || index;
  }
}

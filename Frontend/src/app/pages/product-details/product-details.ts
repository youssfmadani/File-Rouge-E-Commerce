import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, ParamMap, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
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
  get productImages(): string[] {
    if (this.product && this.product['image']) {
      return [this.product['image']];
    }
    return [];
  }
  
  // Tab state
  activeTab: string = 'description';
  
  // Cart state
  isAddingToCart = false;
  addToCartSuccess = false;
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes to reload product when ID changes
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        console.log('Route param changed, product ID:', id);
        if (id) {
          const productId = parseInt(id, 10);
          if (!isNaN(productId)) {
            this.loading = true;
            this.error = '';
            return this.productService.getProductById(productId);
          } else {
            throw new Error('Invalid product ID');
          }
        } else {
          throw new Error('No product ID provided');
        }
      })
    ).subscribe({
      next: (product) => {
        console.log('Product loaded:', product);
        this.product = product;
        this.loadRelatedProducts();
        this.loading = false;
        this.error = '';
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = error.message || 'Failed to load product. Please try again.';
        this.loading = false;
        this.product = null;
      }
    });
  }

  loadRelatedProducts(): void {
    if (!this.product) return;
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Get products from same category, excluding current product
        this.relatedProducts = products
          .filter(p => p['id'] !== this.product!['id'] && p['category'] === this.product!['category'])
          .slice(0, 4);
        console.log('Related products loaded:', this.relatedProducts);
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
      this.successMessage = `${this.getProductTitle()} added to cart successfully!`;
      console.log('Added to cart:', {
        product: this.product,
        quantity: this.quantity,
        color: this.selectedColor,
        size: this.selectedSize
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        this.addToCartSuccess = false;
        this.successMessage = '';
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

  // Event handlers for related products
  onAddToCart(product: Product): void {
    console.log('Adding to cart from related products:', product);
    
    try {
      this.cartService.addToCart(product, 1, {
        color: 'default',
        size: 'default'
      });
      
      // Show success feedback
      this.successMessage = `${product.title || product.nom || product.name || 'Product'} added to cart successfully!`;
      this.addToCartSuccess = true;
      console.log(this.successMessage);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        this.addToCartSuccess = false;
        this.successMessage = '';
      }, 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  onAddToWishlist(product: Product): void {
    console.log('Adding to wishlist from related products:', product);
    // TODO: Implement wishlist service when available
    console.log('Wishlist functionality will be implemented soon!');
  }

  onAddToCompare(product: Product): void {
    console.log('Adding to compare from related products:', product);
    // TODO: Implement compare service when available
    console.log('Compare functionality will be implemented soon!');
  }

  onBuyNow(product: Product): void {
    console.log('Buying now from related products:', product);
    
    try {
      // Add to cart first
      this.cartService.addToCart(product, 1, {
        color: 'default',
        size: 'default'
      });
      
      // Navigate to cart for checkout
      this.router.navigate(['/cart']);
      
    } catch (error) {
      console.error('Error in buy now:', error);
    }
  }

  // Utility methods
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
    const rating = this.getProductRating();
    return star <= rating;
  }

  // Template helper methods to avoid optional chaining warnings
  getProductTitle(): string {
    if (!this.product) return 'Product';
    return this.product['title'] || this.product['nom'] || this.product['name'] || 'Product';
  }

  getProductImage(): string {
    if (!this.product) return '';
    if (this.productImages && this.productImages.length > 0) {
      return this.productImages[this.selectedImageIndex] || this.product['image'] || '';
    }
    return this.product['image'] || '';
  }

  getProductCategory(): string {
    if (!this.product) return 'Product Category';
    // Handle both category field and nested categorie object
    if (this.product['category']) {
      return this.product['category'];
    }
    if (this.product['categorie'] && this.product['categorie']['nom']) {
      return this.product['categorie']['nom'];
    }
    return 'Product Category';
  }

  getProductRating(): number {
    if (!this.product) return 0;
    return this.product['rating'] || 0;
  }

  getProductReviewCount(): number {
    if (!this.product) return 0;
    return this.product['reviewCount'] || 0;
  }

  getProductDescription(): string {
    if (!this.product) return 'High-quality product with premium features and excellent performance. Perfect for everyday use and professional applications.';
    return this.product['description'] || 'High-quality product with premium features and excellent performance. Perfect for everyday use and professional applications.';
  }

  getProductBrand(): string {
    if (!this.product) return 'Premium Brand';
    return this.product['brand'] || 'Premium Brand';
  }

  getProductModel(): string {
    if (!this.product) return 'Latest Model';
    return this.product['model'] || 'Latest Model';
  }

  getProductWeight(): string {
    if (!this.product) return '1.2 kg';
    return this.product['weight'] || '1.2 kg';
  }

  getProductDimensions(): string {
    if (!this.product) return '25 x 15 x 8 cm';
    return this.product['dimensions'] || '25 x 15 x 8 cm';
  }

  // Get product price with fallback
  getProductPrice(): number {
    if (!this.product) return 0;
    return this.product['price'] || this.product['prix'] || 0;
  }

  hasOriginalPrice(): boolean {
    if (!this.product) return false;
    return !!(this.product['originalPrice'] && this.getProductPrice());
  }

  getDiscountPercentage(): number {
    if (!this.product || !this.product['originalPrice'] || !this.getProductPrice()) return 0;
    const discount = ((this.product['originalPrice'] - this.getProductPrice()) / this.product['originalPrice']) * 100;
    return Math.round(discount);
  }

  getSavingsAmount(): number {
    if (!this.hasOriginalPrice() || !this.product) return 0;
    const originalPrice = this.product['originalPrice'] as number;
    const currentPrice = this.getProductPrice();
    return originalPrice - currentPrice;
  }

  getOriginalPrice(): number {
    if (!this.product) return 0;
    return this.product['originalPrice'] as number || 0;
  }

  getStockQuantity(): number {
    if (!this.product) return 0;
    return this.product['stock'] || 0;
  }

  getProductId(): string {
    if (!this.product) return 'N/A';
    return this.product['id'] ? `P-${this.product['id']}` : 'N/A';
  }

  trackByProduct(index: number, product: Product): number {
    return product['id'] || index;
  }
}
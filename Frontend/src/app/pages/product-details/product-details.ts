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
  
  quantity: number = 1;
  selectedColor: string = 'black';
  selectedSize: string = 'M';
  selectedImageIndex: number = 0;
  
  availableColors = [
    { name: 'black', label: 'Black', code: '#000000' },
    { name: 'white', label: 'White', code: '#FFFFFF' },
    { name: 'blue', label: 'Blue', code: '#3B82F6' },
    { name: 'red', label: 'Red', code: '#EF4444' }
  ];
  
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  
  get productImages(): string[] {
    if (this.product && this.product['image']) {
      return [this.product['image']];
    }
    return [];
  }
  
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
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
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
        this.product = product;
        this.loadRelatedProducts();
        this.loading = false;
        this.error = '';
      },
      error: (error) => {
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
        this.relatedProducts = products
          .filter(p => p['id'] !== this.product!['id'] && p['category'] === this.product!['category'])
          .slice(0, 4);
      },
      error: (error) => {
      }
    });
  }

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

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  addToCart(): void {
    if (!this.product) {
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
      
      setTimeout(() => {
        this.addToCartSuccess = false;
        this.successMessage = '';
      }, 3000);
      
    } catch (error) {
    } finally {
      this.isAddingToCart = false;
    }
  }

  buyNow(): void {
    if (!this.product) {
      return;
    }

    this.addToCart();
    
    setTimeout(() => {
      this.router.navigate(['/cart']);
    }, 500);
  }

  addToWishlist(): void {
    if (!this.product) {
      return;
    }

    alert('Wishlist functionality will be implemented soon!');
  }

  onAddToCart(product: Product): void {
    try {
      this.cartService.addToCart(product, 1, {
        color: 'default',
        size: 'default'
      });
      
      this.successMessage = `${product.title || product.nom || product.name || 'Product'} added to cart successfully!`;
      this.addToCartSuccess = true;
      
      setTimeout(() => {
        this.addToCartSuccess = false;
        this.successMessage = '';
      }, 3000);
      
    } catch (error) {
    }
  }

  onAddToWishlist(product: Product): void {
  }

  onAddToCompare(product: Product): void {
  }

  onBuyNow(product: Product): void {
    try {
      this.cartService.addToCart(product, 1, {
        color: 'default',
        size: 'default'
      });
      
      this.router.navigate(['/cart']);
      
    } catch (error) {
    }
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
    const rating = this.getProductRating();
    return star <= rating;
  }

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
    if (this.product && this.product['category']) {
      return this.product['category'];
    }
    if (this.product && this.product['categorie'] && this.product['categorie']['nom']) {
      return this.product['categorie']['nom'];
    }
    return '';
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
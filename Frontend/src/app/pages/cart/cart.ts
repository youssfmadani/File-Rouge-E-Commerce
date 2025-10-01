import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { CartService, CartItem, CartSummary } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, ProductCardComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  };
  recommendedProducts: Product[] = [];
  
  // UI State
  loading = false;
  error = '';
  orderSuccess = false;
  isProcessingOrder = false;
  
  // Promo code
  promoCode = '';
  promoCodeApplied = false;
  promoCodeMessage = '';
  
  // Subscriptions
  private cartSubscription: Subscription = new Subscription();
  
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Cart component initializing...');
    
    // Try to migrate any legacy authentication data first
    this.authService.migrateLegacyData();
    
    // Add a small delay to ensure localStorage operations are complete
    setTimeout(() => {
      this.subscribeToCart();
      this.loadRecommendedProducts();
      
      // Debug authentication state after migration
      this.debugAuthState();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private subscribeToCart(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cartSummary = this.cartService.getCartSummary();
        console.log('Cart updated:', { items, summary: this.cartSummary });
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.error = 'Failed to load cart items';
      }
    });
  }

  private loadRecommendedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Get random products for recommendations, excluding items already in cart
        const cartProductIds = this.cartItems.map(item => item.product.id);
        const availableProducts = products.filter(p => !cartProductIds.includes(p.id));
        this.recommendedProducts = this.shuffleArray(availableProducts).slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading recommended products:', error);
      }
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Cart manipulation methods
  increaseQuantity(item: CartItem): void {
    this.cartService.increaseQuantity(item.product.id!, {
      color: item.selectedColor,
      size: item.selectedSize
    });
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.decreaseQuantity(item.product.id!, {
      color: item.selectedColor,
      size: item.selectedSize
    });
  }

  updateQuantity(item: CartItem, event: any): void {
    const quantity = parseInt(event.target.value);
    if (quantity > 0) {
      this.cartService.updateQuantity(item.product.id!, quantity, {
        color: item.selectedColor,
        size: item.selectedSize
      });
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: CartItem): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeFromCart(item.product.id!, {
        color: item.selectedColor,
        size: item.selectedSize
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
    }
  }

  // Cart summary methods
  getTotalItems(): number {
    return this.cartSummary.totalItems;
  }

  getSubtotal(): number {
    return this.cartSummary.subtotal;
  }

  getShippingCost(): number {
    return this.cartSummary.shipping;
  }

  getTax(): number {
    return this.cartSummary.tax;
  }

  getDiscount(): number {
    return this.cartSummary.discount;
  }

  getTotal(): number {
    return this.cartSummary.total;
  }

  // Promo code methods
  applyPromoCode(): void {
    if (!this.promoCode.trim()) {
      this.promoCodeMessage = 'Please enter a promo code';
      return;
    }

    // In a real implementation, this would call an API
    this.promoCodeApplied = true;
    this.promoCodeMessage = 'Promo code applied successfully!';
    
    // For demo purposes, apply a 10% discount
    this.cartSummary.discount = this.cartSummary.subtotal * 0.1;
    this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.shipping + this.cartSummary.tax - this.cartSummary.discount;
  }

  // Checkout method
  proceedToCheckout(): void {
    console.log('Proceed to checkout clicked...');
    
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Enhanced authentication check
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login...');
      if (confirm('You need to login to place an order. Would you like to login now?')) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      }
      return;
    }

    // Process order
    this.isProcessingOrder = true;
    
    // Simulate order processing
    setTimeout(() => {
      this.isProcessingOrder = false;
      this.orderSuccess = true;
      
      // Clear cart after successful order
      this.cartService.clearCart();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        this.orderSuccess = false;
      }, 5000);
    }, 2000);
  }

  // Emergency fix for user data
  emergencyFixUser(): void {
    // This is a temporary fix for authentication issues
    console.log('Emergency user fix triggered...');
    
    // Clear any corrupted auth data
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('userEmail');
    
    alert('Authentication data cleared. Please login again.');
    this.router.navigate(['/login']);
  }

  // Navigation methods
  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  // Utility methods
  getItemTotal(item: CartItem): number {
    return (item.product.price || 0) * item.quantity;
  }

  getItemDisplayName(item: CartItem): string {
    let name = item.product.title || 'Product';
    if (item.selectedColor) {
      name += ` - ${item.selectedColor}`;
    }
    if (item.selectedSize) {
      name += ` (${item.selectedSize})`;
    }
    return name;
  }

  getColorCode(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'blue': '#3B82F6',
      'red': '#EF4444',
      'green': '#10B981',
      'yellow': '#F59E0B',
      'purple': '#8B5CF6',
      'pink': '#EC4899',
      'gray': '#6B7280',
      'brown': '#92400E'
    };
    return colorMap[colorName.toLowerCase()] || '#6B7280';
  }

  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  trackByCartItem(index: number, item: CartItem): string {
    return `${item.product.id}-${item.selectedColor}-${item.selectedSize}`;
  }

  trackByProduct(index: number, product: Product): number {
    return product.id || index;
  }

  // Debug method to check authentication state
  debugAuthState(): void {
    console.log('=== Authentication Debug Info ===');
    console.log('Is Authenticated:', this.authService.isAuthenticated());
    console.log('Current User:', this.authService.getCurrentUser());
    console.log('User Role:', this.authService.getUserRole());
    console.log('Token:', this.authService.getToken());
    
    // Additional debugging for localStorage
    console.log('Raw localStorage values:');
    console.log('  - auth_user:', localStorage.getItem('auth_user'));
    console.log('  - auth_token:', localStorage.getItem('auth_token'));
    console.log('  - auth_role:', localStorage.getItem('auth_role'));
    console.log('  - auth_email:', localStorage.getItem('auth_email'));
    console.log('  - userEmail:', localStorage.getItem('userEmail'));
    
    console.log('=== End Debug Info ===');
  }
}
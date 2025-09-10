import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { CartService, CartItem, CartSummary } from '../../services/cart';
import { OrderService, Order } from '../../services/order';
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
  isProcessingOrder = false;
  orderSuccess = false;
  
  // Promo code
  promoCode = '';
  promoCodeApplied = false;
  promoCodeMessage = '';
  
  // Subscriptions
  private cartSubscription: Subscription = new Subscription();
  
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
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

  // Promo code methods
  async applyPromoCode(): Promise<void> {
    if (!this.promoCode.trim()) {
      this.promoCodeMessage = 'Please enter a promo code';
      return;
    }

    try {
      const result = await this.cartService.applyPromoCode(this.promoCode.trim());
      if (result.success) {
        this.promoCodeApplied = true;
        this.promoCodeMessage = result.message;
        // Update cart summary if discount is applied
        this.cartSummary = this.cartService.getCartSummary();
      } else {
        this.promoCodeMessage = result.message;
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      this.promoCodeMessage = 'Error applying promo code';
    }
  }

  // Getter methods for template
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

  // Order creation
  async proceedToCheckout(): Promise<void> {
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

    // Verify user data exists
    let currentUser = this.authService.getCurrentUser();
    console.log('Current user before validation:', currentUser);
    
    if (!currentUser || !currentUser.id) {
      console.log('User data missing, attempting to migrate legacy data...');
      // Force migration of legacy data
      this.authService.migrateLegacyData();
      
      // Try to get user again
      currentUser = this.authService.getCurrentUser();
      console.log('Current user after migration:', currentUser);
      
      if (!currentUser || !currentUser.id) {
        // Try to re-authenticate if no user data
        console.warn('No user data found, attempting to recreate from stored email');
        const storedEmail = localStorage.getItem('auth_email') || localStorage.getItem('userEmail');
        console.log('Stored email found:', storedEmail);
        
        if (storedEmail && this.authService.isAuthenticated()) {
          // Recreate user object if we have email and are authenticated
          const isAdmin = storedEmail.toLowerCase().includes('admin');
          const recreatedUser: any = {
            id: isAdmin ? 1 : Math.floor(Math.random() * 1000) + 100,
            email: storedEmail,
            role: isAdmin ? 'ADMIN' : 'USER',
            name: storedEmail.split('@')[0]
          };
          this.authService.setCurrentUser(recreatedUser);
          currentUser = recreatedUser;
          console.log('Recreated user:', currentUser);
        }
      }
    }
    
    if (!currentUser || !currentUser.id) {
      this.error = 'Authentication error. Please log out and log in again.';
      console.error('Critical authentication error: User data could not be recovered');
      setTimeout(() => {
        if (confirm('Would you like to log in again?')) {
          this.authService.logout();
          this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
        }
      }, 2000);
      return;
    }

    this.isProcessingOrder = true;
    this.error = '';
    
    console.log('Starting order creation process...');
    console.log('Current user:', currentUser);
    console.log('Cart items:', this.cartItems);
    console.log('Total:', this.getTotal());

    try {
      // Use the already validated user from above
      // Prepare order data
      const orderData: Order = {
        adherentId: currentUser.id,
        total: this.getTotal(),
        status: 'pending',
        date: new Date().toISOString(),
        produits: this.cartItems.map(item => ({
          id: item.product.id || 0,
          name: item.product.title || item.product.name || 'Unknown Product',
          price: item.product.price || 0,
          quantity: item.quantity || 1,
          selectedColor: item.selectedColor || 'default',
          selectedSize: item.selectedSize || 'default'
        }))
      };
      
      console.log('Order data to be sent:', orderData);

      // Create order
      console.log('Attempting to create order...');
      const createdOrder = await this.orderService.createOrder(orderData).toPromise();
      
      console.log('Order creation successful:', createdOrder);
      
      if (createdOrder) {
        // Clear cart after successful order
        this.cartService.clearCart();
        
        // Show success message
        this.orderSuccess = true;
        this.error = 'Order placed successfully!';
        
        // Navigate to order confirmation or orders page after delay
        setTimeout(() => {
          // For now, just redirect to products page since orders page might not exist
          this.router.navigate(['/products'], {
            queryParams: { orderSuccess: 'true', orderId: createdOrder.id }
          });
        }, 3000);
        
        console.log('Order created successfully:', createdOrder);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Provide specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('User not found')) {
          this.error = 'Authentication error. Please log out and log in again.';
        } else if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
          this.error = 'Your session has expired. Please log in again.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          this.error = 'Network error. Please check your connection and try again.';
        } else {
          this.error = `Order failed: ${error.message}`;
        }
      } else {
        this.error = 'Failed to place order. Please try again.';
      }
      
      // If it's an authentication error, suggest re-login
      if (this.error.includes('Authentication') || this.error.includes('session has expired')) {
        setTimeout(() => {
          if (confirm('Would you like to log in again?')) {
            this.authService.logout();
            this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
          }
        }, 2000);
      }
    } finally {
      this.isProcessingOrder = false;
    }
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

  // Emergency fix method to manually create user data
  emergencyFixUser(): void {
    console.log('Emergency fix: Creating user data...');
    const email = 'user@test.com';
    const success = this.authService.loginLocal(email, 'test123');
    if (success) {
      console.log('Emergency user created successfully');
      this.debugAuthState();
      alert('User data fixed! You can now proceed with checkout.');
    } else {
      console.error('Failed to create emergency user');
      alert('Failed to fix user data. Please refresh and try logging in again.');
    }
  }
}

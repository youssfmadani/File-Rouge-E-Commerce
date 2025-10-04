import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { CartService, CartItem, CartSummary } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { ProductService, Product } from '../../services/product';
import { OrderService, Order } from '../../services/order.service';

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
  
  loading = false;
  error = '';
  orderSuccess = false;
  isProcessingOrder = false;
  
  promoCode = '';
  promoCodeApplied = false;
  promoCodeMessage = '';
  
  private cartSubscription: Subscription = new Subscription();
  
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.migrateLegacyData();
    
    setTimeout(() => {
      this.subscribeToCart();
      this.loadRecommendedProducts();
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
      },
      error: (error) => {
        this.error = 'Failed to load cart items';
      }
    });
  }

  private loadRecommendedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const cartProductIds = this.cartItems.map(item => item.product.id);
        const availableProducts = products.filter(p => !cartProductIds.includes(p.id));
        this.recommendedProducts = this.shuffleArray(availableProducts).slice(0, 4);
      },
      error: (error) => {
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

  applyPromoCode(): void {
    if (!this.promoCode.trim()) {
      this.promoCodeMessage = 'Please enter a promo code';
      return;
    }

    this.promoCodeApplied = true;
    this.promoCodeMessage = 'Promo code applied successfully!';
    
    this.cartSummary.discount = this.cartSummary.subtotal * 0.1;
    this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.shipping + this.cartSummary.tax - this.cartSummary.discount;
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!this.authService.isAuthenticated()) {
      if (confirm('You need to login to place an order. Would you like to login now?')) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      }
      return;
    }

    this.isProcessingOrder = true;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.error = 'Unable to get user information. Please log in again.';
      this.isProcessingOrder = false;
      return;
    }
    
    const order: Order = {
      dateCommande: new Date(),
      statut: 'EN_COURS',
      adherentId: currentUser.id,
      montantTotal: this.cartSummary.total,
      produits: this.cartItems.map(item => ({
        id: item.product.id,
        nom: item.product.nom || item.product.name || item.product.title,
        prix: item.product.prix || item.product.price,
        quantity: item.quantity
      }))
    };
    
    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        this.isProcessingOrder = false;
        this.orderSuccess = true;
        
        this.cartService.clearCart();
        
        setTimeout(() => {
          this.orderSuccess = false;
        }, 5000);
      },
      error: (error) => {
        this.error = error.message || 'Failed to create order. Please try again.';
        this.isProcessingOrder = false;
      }
    });
  }

  emergencyFixUser(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('userEmail');
    
    alert('Authentication data cleared. Please login again.');
    this.router.navigate(['/login']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

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
}
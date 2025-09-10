import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'shopping_cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Add item to cart
  addToCart(product: Product, quantity: number = 1, options?: { color?: string; size?: string }): void {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(item => 
      item.product.id === product.id && 
      item.selectedColor === options?.color &&
      item.selectedSize === options?.size
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity,
        selectedColor: options?.color,
        selectedSize: options?.size
      };
      currentItems.push(newItem);
    }

    this.updateCart(currentItems);
  }

  // Remove item from cart
  removeFromCart(productId: number, options?: { color?: string; size?: string }): void {
    const currentItems = this.getCartItems();
    const filteredItems = currentItems.filter(item => 
      !(item.product.id === productId && 
        item.selectedColor === options?.color &&
        item.selectedSize === options?.size)
    );
    this.updateCart(filteredItems);
  }

  // Update item quantity
  updateQuantity(productId: number, quantity: number, options?: { color?: string; size?: string }): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, options);
      return;
    }

    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex(item => 
      item.product.id === productId && 
      item.selectedColor === options?.color &&
      item.selectedSize === options?.size
    );

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity = quantity;
      this.updateCart(currentItems);
    }
  }

  // Increase item quantity
  increaseQuantity(productId: number, options?: { color?: string; size?: string }): void {
    const currentItems = this.getCartItems();
    const item = currentItems.find(item => 
      item.product.id === productId && 
      item.selectedColor === options?.color &&
      item.selectedSize === options?.size
    );

    if (item) {
      this.updateQuantity(productId, item.quantity + 1, options);
    }
  }

  // Decrease item quantity
  decreaseQuantity(productId: number, options?: { color?: string; size?: string }): void {
    const currentItems = this.getCartItems();
    const item = currentItems.find(item => 
      item.product.id === productId && 
      item.selectedColor === options?.color &&
      item.selectedSize === options?.size
    );

    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1, options);
    } else if (item && item.quantity <= 1) {
      this.removeFromCart(productId, options);
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.updateCart([]);
  }

  // Get cart summary
  getCartSummary(): CartSummary {
    const items = this.getCartItems();
    const subtotal = items.reduce((sum, item) => sum + ((item.product.price || 0) * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate shipping (free over $100, otherwise $9.99)
    const shipping = subtotal > 100 ? 0 : 9.99;
    
    // Calculate tax (8% of subtotal)
    const tax = subtotal * 0.08;
    
    // Discount (can be extended for promo codes)
    const discount = 0;
    
    const total = subtotal + shipping + tax - discount;

    return {
      totalItems,
      subtotal,
      shipping,
      tax,
      discount,
      total
    };
  }

  // Check if product is in cart
  isInCart(productId: number): boolean {
    return this.getCartItems().some(item => item.product.id === productId);
  }

  // Get item count for specific product
  getItemCount(productId: number): number {
    const items = this.getCartItems();
    return items
      .filter(item => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  // Apply promo code (placeholder for future implementation)
  applyPromoCode(code: string): Promise<{ success: boolean; message: string; discount?: number }> {
    // This would typically make an API call to validate the promo code
    return Promise.resolve({
      success: false,
      message: 'Promo code functionality not implemented yet'
    });
  }

  // Get cart for order creation
  getCartForOrder(): any {
    const items = this.getCartItems();
    const summary = this.getCartSummary();
    
    return {
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      })),
      summary
    };
  }

  // Private methods
  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.saveCartToStorage(items);
  }

  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        this.cartItemsSubject.next(items);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }
}
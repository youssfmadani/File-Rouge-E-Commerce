import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        console.log('Products loaded:', products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  onAddToCart(product: Product) {
    console.log('Adding to cart:', product);
    // TODO: Implement add to cart functionality
  }

  onAddToWishlist(product: Product) {
    console.log('Adding to wishlist:', product);
    // TODO: Implement add to wishlist functionality
  }

  onAddToCompare(product: Product) {
    console.log('Adding to compare:', product);
    // TODO: Implement add to compare functionality
  }

  onBuyNow(product: Product) {
    console.log('Buying now:', product);
    // TODO: Implement buy now functionality
  }

  trackByProduct(index: number, product: Product): number {
    return product.id || index;
  }
}

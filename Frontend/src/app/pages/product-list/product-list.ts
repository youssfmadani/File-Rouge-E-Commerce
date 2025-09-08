import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService, Product } from '../../services/product';

interface PriceRange {
  absolute: { min: number; max: number };
  current: { min: number; max: number };
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error: string = '';
  
  // Filter states
  selectedCategories = new Set<string>(['all']);
  selectedBrands = new Set<string>();
  selectedRatings = new Set<number>();
  
  // Price range
  priceRange: PriceRange = {
    absolute: { min: 0, max: 1000 },
    current: { min: 0, max: 1000 }
  };
  
  // View and sorting
  currentView: 'grid' | 'list' = 'grid';
  currentSort: string = 'featured';

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
        this.setupPriceRange();
        this.applyFilters();
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

  // Price Range Methods
  setupPriceRange(): void {
    if (this.products.length === 0) return;
    
    const prices = this.products.map(p => p.price || 0);
    this.priceRange.absolute.min = Math.floor(Math.min(...prices));
    this.priceRange.absolute.max = Math.ceil(Math.max(...prices));
    this.priceRange.current.min = this.priceRange.absolute.min;
    this.priceRange.current.max = this.priceRange.absolute.max;
  }

  onMinPriceChange(event: any): void {
    const value = parseInt(event.target.value);
    if (value <= this.priceRange.current.max) {
      this.priceRange.current.min = value;
    }
  }

  onMaxPriceChange(event: any): void {
    const value = parseInt(event.target.value);
    if (value >= this.priceRange.current.min) {
      this.priceRange.current.max = value;
    }
  }

  validatePriceRange(): void {
    if (this.priceRange.current.min > this.priceRange.current.max) {
      [this.priceRange.current.min, this.priceRange.current.max] = 
      [this.priceRange.current.max, this.priceRange.current.min];
    }
    this.applyFilters();
  }

  getSliderLeftPercent(): number {
    const range = this.priceRange.absolute.max - this.priceRange.absolute.min;
    return range === 0 ? 0 : ((this.priceRange.current.min - this.priceRange.absolute.min) / range) * 100;
  }

  getSliderWidthPercent(): number {
    const range = this.priceRange.absolute.max - this.priceRange.absolute.min;
    return range === 0 ? 100 : ((this.priceRange.current.max - this.priceRange.current.min) / range) * 100;
  }

  applyQuickPrice(min: number, max: number): void {
    this.priceRange.current.min = min;
    this.priceRange.current.max = max;
    this.applyFilters();
  }

  isQuickPriceActive(min: number, max: number): boolean {
    return this.priceRange.current.min === min && this.priceRange.current.max === max;
  }

  applyPriceFilter(): void {
    this.applyFilters();
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

  // Filter Methods
  onCategoryFilter(category: string, event: any): void {
    if (category === 'all') {
      if (event.target.checked) {
        this.selectedCategories.clear();
        this.selectedCategories.add('all');
      }
    } else {
      this.selectedCategories.delete('all');
      if (event.target.checked) {
        this.selectedCategories.add(category);
      } else {
        this.selectedCategories.delete(category);
      }
      if (this.selectedCategories.size === 0) {
        this.selectedCategories.add('all');
      }
    }
    this.applyFilters();
  }

  onBrandFilter(brand: string, event: any): void {
    if (event.target.checked) {
      this.selectedBrands.add(brand);
    } else {
      this.selectedBrands.delete(brand);
    }
    this.applyFilters();
  }

  onRatingFilter(rating: number, event: any): void {
    if (event.target.checked) {
      this.selectedRatings.add(rating);
    } else {
      this.selectedRatings.delete(rating);
    }
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedCategories.clear();
    this.selectedCategories.add('all');
    this.selectedBrands.clear();
    this.selectedRatings.clear();
    this.priceRange.current.min = this.priceRange.absolute.min;
    this.priceRange.current.max = this.priceRange.absolute.max;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Category filter
    if (!this.selectedCategories.has('all')) {
      filtered = filtered.filter(product => 
        this.selectedCategories.has((product['category'] || '').toLowerCase())
      );
    }

    // Brand filter
    if (this.selectedBrands.size > 0) {
      filtered = filtered.filter(product => 
        this.selectedBrands.has((product['brand'] || '').toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(product => {
      const price = product.price || 0;
      return price >= this.priceRange.current.min && price <= this.priceRange.current.max;
    });

    // Rating filter
    if (this.selectedRatings.size > 0) {
      filtered = filtered.filter(product => {
        const rating = product['rating'] || 0;
        return Array.from(this.selectedRatings).some(selectedRating => rating >= selectedRating);
      });
    }

    this.filteredProducts = this.sortProducts(filtered);
  }

  // View and Sorting Methods
  setView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }

  onSortChange(): void {
    this.applyFilters();
  }

  sortProducts(products: Product[]): Product[] {
    const sorted = [...products];
    
    switch (this.currentSort) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name-asc':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'name-desc':
        return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      case 'rating':
        return sorted.sort((a, b) => (b['rating'] || 0) - (a['rating'] || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b['createdAt'] || 0).getTime() - new Date(a['createdAt'] || 0).getTime());
      default:
        return sorted;
    }
  }

  // Display Methods
  getDisplayedProductsCount(): string {
    const start = Math.min(1, this.filteredProducts.length);
    const end = this.filteredProducts.length;
    return `${start}-${end}`;
  }

  getTotalProductsCount(): number {
    return this.products.length;
  }

  hasActiveFilters(): boolean {
    return !this.selectedCategories.has('all') || 
           this.selectedBrands.size > 0 || 
           this.selectedRatings.size > 0 ||
           this.priceRange.current.min !== this.priceRange.absolute.min ||
           this.priceRange.current.max !== this.priceRange.absolute.max;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (!this.selectedCategories.has('all')) count += this.selectedCategories.size;
    count += this.selectedBrands.size;
    count += this.selectedRatings.size;
    if (this.priceRange.current.min !== this.priceRange.absolute.min || 
        this.priceRange.current.max !== this.priceRange.absolute.max) count++;
    return count;
  }
}

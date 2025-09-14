import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { ProductCardComponent } from '../../components/product-card/product-card';

interface PriceRange {
  absolute: { min: number; max: number };
  current: { min: number; max: number };
}

@Component({
  selector: 'app-perfect-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './perfect-product-list.html',
  styleUrls: ['./perfect-product-list.css']
})
export class PerfectProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error: string = '';
  addToCartSuccess: boolean = false;
  successMessage: string = '';
  
  // Filter states
  selectedCategories = new Set<string>(['all']);
  selectedBrands = new Set<string>();
  selectedRatings = new Set<number>();
  searchQuery: string = '';
  
  // Price range
  priceRange: PriceRange = {
    absolute: { min: 0, max: 1000 },
    current: { min: 0, max: 1000 }
  };
  
  // View and sorting
  currentView: 'grid' | 'list' = 'grid';
  currentSort: string = 'featured';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

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
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (value <= this.priceRange.current.max) {
      this.priceRange.current.min = value;
    }
    this.applyFilters();
  }

  onMaxPriceChange(event: any): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (value >= this.priceRange.current.min) {
      this.priceRange.current.max = value;
    }
    this.applyFilters();
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
    try {
      this.cartService.addToCart(product, 1);
      
      // Show success feedback
      this.successMessage = `${product.title || 'Product'} added to cart successfully!`;
      this.addToCartSuccess = true;
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        this.addToCartSuccess = false;
        this.successMessage = '';
      }, 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  onAddToWishlist(product: Product) {
    console.log('Adding to wishlist:', product);
    // TODO: Implement wishlist service when available
    alert('Wishlist functionality will be implemented soon!');
  }

  onAddToCompare(product: Product) {
    console.log('Adding to compare:', product);
    // TODO: Implement compare service when available
    alert('Compare functionality will be implemented soon!');
  }

  onBuyNow(product: Product) {
    console.log('Buying now:', product);
    
    try {
      // Add to cart first
      this.cartService.addToCart(product, 1);
      
    } catch (error) {
      console.error('Error in buy now:', error);
    }
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

  applySearchFilter(): void {
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedCategories.clear();
    this.selectedCategories.add('all');
    this.selectedBrands.clear();
    this.selectedRatings.clear();
    this.searchQuery = '';
    this.priceRange.current.min = this.priceRange.absolute.min;
    this.priceRange.current.max = this.priceRange.absolute.max;
    this.applyFilters();
  }

  resetAllFilters(): void {
    this.clearAllFilters();
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(product => 
        (product.title || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

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
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePagination();
  }

  // View and Sorting Methods
  setView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }

  onSortChange(sort: string): void {
    this.currentSort = sort;
    this.applyFilters();
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.currentSort) {
      case 'price-low':
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return [...products].sort((a, b) => 
          new Date(b['createdAt'] || '').getTime() - new Date(a['createdAt'] || '').getTime()
        );
      case 'featured':
      default:
        return [...products].sort((a, b) => 
          (b['isFeatured'] ? 1 : 0) - (a['isFeatured'] ? 1 : 0) || (b.rating || 0) - (a.rating || 0)
        );
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

  getUniqueCategories(): string[] {
    const categories = new Set<string>();
    this.products.forEach(product => {
      const category = (product['category'] || '').toLowerCase();
      if (category) {
        categories.add(category);
      }
    });
    return Array.from(categories).sort();
  }

  getUniqueBrands(): string[] {
    const brands = new Set<string>();
    this.products.forEach(product => {
      const brand = (product['brand'] || '').toLowerCase();
      if (brand) {
        brands.add(brand);
      }
    });
    return Array.from(brands).sort();
  }

  getUniqueBrandsCount(): number {
    return this.getUniqueBrands().length;
  }

  getAverageRating(): number {
    if (this.products.length === 0) return 0;
    const totalRating = this.products.reduce((sum, product) => sum + (product['rating'] || 0), 0);
    return totalRating / this.products.length;
  }

  getUniqueRatings(): number[] {
    const ratings = new Set<number>();
    this.products.forEach(product => {
      const rating = Math.floor(product['rating'] || 0);
      if (rating > 0) {
        ratings.add(rating);
      }
    });
    return Array.from(ratings).sort((a, b) => b - a);
  }

  hasActiveFilters(): boolean {
    return !this.selectedCategories.has('all') || 
           this.selectedBrands.size > 0 || 
           this.selectedRatings.size > 0 ||
           this.searchQuery.length > 0 ||
           this.priceRange.current.min !== this.priceRange.absolute.min ||
           this.priceRange.current.max !== this.priceRange.absolute.max;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (!this.selectedCategories.has('all')) count += this.selectedCategories.size;
    count += this.selectedBrands.size;
    count += this.selectedRatings.size;
    if (this.searchQuery.length > 0) count++;
    if (this.priceRange.current.min !== this.priceRange.absolute.min || 
        this.priceRange.current.max !== this.priceRange.absolute.max) count++;
    return count;
  }

  // Pagination Methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  // Utility methods
  resetFilters(): void {
    this.clearAllFilters();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onViewChange(view: 'grid' | 'list'): void {
    this.currentView = view;
  }

  closeNotification(): void {
    this.addToCartSuccess = false;
    this.successMessage = '';
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';

interface PriceRange {
  absolute: { min: number; max: number };
  current: { min: number; max: number };
}

@Component({
  selector: 'app-wonderful-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './wonderful-product-list.html',
  styleUrls: ['./wonderful-product-list.css']
})
export class WonderfulProductList implements OnInit {
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
    private cartService: CartService,
    private router: Router
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
  }

  onMaxPriceChange(event: any): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
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
    try {
      // Add to cart first
      this.cartService.addToCart(product, 1);
      
      // Navigate to cart for checkout
      this.router.navigate(['/cart']);
      
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

  onSearchChange(): void {
    this.applyFilters();
  }

  // Sorting Methods
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

  // View Methods
  setView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }

  // Filter Application
  applyFilters(): void {
    let filtered = [...this.products];

    // Category filter
    if (!this.selectedCategories.has('all') && this.selectedCategories.size > 0) {
      filtered = filtered.filter(product => 
        product.category && this.selectedCategories.has(product.category)
      );
    }

    // Brand filter
    if (this.selectedBrands.size > 0) {
      filtered = filtered.filter(product => 
        product.brand && this.selectedBrands.has(product.brand)
      );
    }

    // Rating filter
    if (this.selectedRatings.size > 0) {
      filtered = filtered.filter(product => {
        const productRating = Math.floor(product.rating || 0);
        return Array.from(this.selectedRatings).some(rating => productRating >= rating);
      });
    }

    // Price filter
    filtered = filtered.filter(product => {
      const price = product.price || 0;
      return price >= this.priceRange.current.min && price <= this.priceRange.current.max;
    });

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        (product.title && product.title.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query)) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered = this.sortProducts(filtered);

    // Apply pagination
    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
  }

  // Pagination Methods
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getCategories(): string[] {
    const categories = this.products
      .map(p => p.category)
      .filter((category, index, self) => 
        category && self.indexOf(category) === index
      ) as string[];
    return categories.sort();
  }

  getBrands(): string[] {
    const brands = this.products
      .map(p => p.brand)
      .filter((brand, index, self) => 
        brand && self.indexOf(brand) === index
      ) as string[];
    return brands.sort();
  }

  closeNotification(): void {
    this.addToCartSuccess = false;
    this.successMessage = '';
  }
}
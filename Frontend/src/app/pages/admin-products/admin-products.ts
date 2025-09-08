import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.css']
})
export class AdminProducts implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Search and filter
  searchTerm = '';
  selectedCategory = '';
  categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'];
  
  // Form states
  showAddForm = false;
  editingProduct: Product | null = null;
  
  // New product form
  newProduct: Partial<Product> = {
    title: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    stock: 0
  };

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products';
        this.isLoading = false;
      }
    });
  }

  // Search and filter methods
  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        (product.title && product.title.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (product.nom && product.nom.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory ||
        (product.categorie && product.categorie.nom === this.selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  // CRUD operations
  showAddProductForm(): void {
    this.showAddForm = true;
    this.editingProduct = null;
    this.resetForm();
  }

  hideAddForm(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.newProduct = { ...product };
    this.showAddForm = true;
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete \"${product.title || product.nom}\"?`)) {
      if (product.id) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.successMessage = 'Product deleted successfully';
            this.loadProducts();
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.errorMessage = 'Failed to delete product';
            setTimeout(() => this.errorMessage = '', 3000);
          }
        });
      }
    }
  }

  saveProduct(): void {
    if (this.validateProduct()) {
      const productData = {
        ...this.newProduct,
        prix: this.newProduct.price, // Map to backend field
        nom: this.newProduct.title   // Map to backend field
      } as Product;

      if (this.editingProduct && this.editingProduct.id) {
        // Update existing product
        this.productService.updateProduct(this.editingProduct.id, productData).subscribe({
          next: () => {
            this.successMessage = 'Product updated successfully';
            this.hideAddForm();
            this.loadProducts();
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.errorMessage = 'Failed to update product';
            setTimeout(() => this.errorMessage = '', 3000);
          }
        });
      } else {
        // Create new product
        this.productService.createProduct(productData).subscribe({
          next: () => {
            this.successMessage = 'Product created successfully';
            this.hideAddForm();
            this.loadProducts();
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error creating product:', error);
            this.errorMessage = 'Failed to create product';
            setTimeout(() => this.errorMessage = '', 3000);
          }
        });
      }
    }
  }

  private validateProduct(): boolean {
    if (!this.newProduct.title || !this.newProduct.price || !this.newProduct.category) {
      this.errorMessage = 'Please fill in all required fields';
      setTimeout(() => this.errorMessage = '', 3000);
      return false;
    }
    
    if (this.newProduct.price <= 0) {
      this.errorMessage = 'Price must be greater than 0';
      setTimeout(() => this.errorMessage = '', 3000);
      return false;
    }
    
    return true;
  }

  private resetForm(): void {
    this.newProduct = {
      title: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      stock: 0
    };
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/admin']);
  }

  // Utility methods
  getProductPrice(product: Product): number {
    return product.price || product.prix || 0;
  }

  getProductTitle(product: Product): string {
    return product.title || product.nom || 'Untitled Product';
  }

  getProductCategory(product: Product): string {
    return product.category || (product.categorie ? product.categorie.nom : '') || 'Uncategorized';
  }
}
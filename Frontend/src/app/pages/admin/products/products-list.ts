import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product';
import { AdminSidebarComponent } from '../../admin/admin-sidebar';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebarComponent],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css']
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  searchProducts(): void {
    if (this.searchTerm.trim() === '') {
      this.loadProducts();
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.productService.searchProducts(this.searchTerm).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.error = 'Failed to search products';
        this.loading = false;
      }
    });
  }

  deleteProduct(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // Remove the product from the list
          this.products = this.products.filter(product => product.id !== id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.error = 'Failed to delete product';
        }
      });
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/products/create']);
  }

  navigateToEdit(id: number | undefined): void {
    if (id === undefined) return;
    this.router.navigate(['/admin/products/edit', id]);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product';
import { CategoryService, Category } from '../../../services/category';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = {};
  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        
        // Ensure category ID is properly set as a number
        if (this.product['categorie'] && typeof this.product['categorie'] === 'object' && this.product['categorie']['id']) {
          this.product.categorieId = Number(this.product['categorie']['id']);
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product: ' + (error.message || 'Unknown error');
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories';
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = null;
    
    // Basic validation
    const productName = this.product['nom'] || this.product['title'] || this.product['name'] || '';
    if (!productName || productName.trim() === '') {
      this.error = 'Product name is required';
      this.loading = false;
      return;
    }
    
    const productDescription = this.product.description || '';
    if (!productDescription || productDescription.trim() === '') {
      this.error = 'Product description is required';
      this.loading = false;
      return;
    }
    
    const productPrice = this.product['prix'] !== undefined ? Number(this.product['prix']) : 
                        (this.product['price'] !== undefined ? Number(this.product['price']) : 0);
    
    if (isNaN(productPrice) || productPrice < 0) {
      this.error = 'Product price must be a valid positive number';
      this.loading = false;
      return;
    }
    
    const productStock = this.product.stock !== undefined ? Number(this.product.stock) : 0;
    
    if (isNaN(productStock) || productStock < 0) {
      this.error = 'Product stock must be a valid positive number';
      this.loading = false;
      return;
    }
    
    // Create a clean product object with only the fields the backend expects
    const productToSend: any = {};
    
    // Required fields - use the French names that the backend expects
    productToSend.nom = productName.trim();
    productToSend.description = productDescription.trim();
    productToSend.prix = productPrice;
    productToSend.stock = productStock;
    
    // Optional fields
    if (this.product['image'] && this.product['image'].trim() !== '') {
      productToSend.image = this.product['image'].trim();
    } else if (this.product['imageUrl'] && this.product['imageUrl'].trim() !== '') {
      productToSend.image = this.product['imageUrl'].trim();
    }
    
    // Handle category ID
    if (this.product.categorieId !== undefined && this.product.categorieId !== null) {
      const categoryId = Number(this.product.categorieId);
      if (!isNaN(categoryId) && categoryId > 0) {
        productToSend.categorieId = categoryId;
      }
    }
    
    console.log('Sending product data:', productToSend);
    
    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productToSend).subscribe({
        next: (updatedProduct) => {
          this.loading = false;
          alert('Product updated successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.error = error.message || 'Failed to update product. Please check all fields and try again.';
          this.loading = false;
        }
      });
    } else {
      this.productService.createProduct(productToSend).subscribe({
        next: (newProduct) => {
          this.loading = false;
          alert('Product created successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.error = error.message || 'Failed to create product. Please check all fields and try again.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  // Helper method to get category name
  getCategoryName(): string {
    if (this.product.category) {
      return this.product.category;
    }
    if (this.product.categorie && typeof this.product.categorie === 'object') {
      return this.product.categorie.nom || '';
    }
    return '';
  }

  // Helper method to set category
  setCategory(categoryId: number): void {
    this.product.categorieId = categoryId;
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      this.product.category = category.nom;
    }
  }
}
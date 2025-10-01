import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category';
import { AdminSidebarComponent } from '../../admin/admin-sidebar';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebarComponent],
  templateUrl: './categories-list.html',
  styleUrls: ['./categories-list.css']
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  searchCategories(): void {
    // Implement search functionality if needed
    // For now, we'll just reload all categories
    this.loadCategories();
  }

  deleteCategory(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          // Remove the category from the list
          this.categories = this.categories.filter(category => category.id !== id);
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.error = 'Failed to delete category';
        }
      });
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/categories/create']);
  }

  navigateToEdit(id: number | undefined): void {
    if (id === undefined) return;
    this.router.navigate(['/admin/categories/edit', id]);
  }
}
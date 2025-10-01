import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category';
import { AdminSidebarComponent } from '../../admin/admin-sidebar';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebarComponent],
  templateUrl: './category-form.html',
  styleUrls: ['./category-form.css']
})
export class CategoryFormComponent implements OnInit {
  category: Category = {};
  isEditMode = false;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadCategory(parseInt(id, 10));
    }
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.category = category;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.error = 'Failed to load category';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      // Update existing category
      if (this.category.id) {
        this.categoryService.updateCategory(this.category.id, this.category).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/admin/categories']);
          },
          error: (error) => {
            console.error('Error updating category:', error);
            this.error = 'Failed to update category';
            this.loading = false;
          }
        });
      }
    } else {
      // Create new category
      this.categoryService.createCategory(this.category).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.error = 'Failed to create category';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}
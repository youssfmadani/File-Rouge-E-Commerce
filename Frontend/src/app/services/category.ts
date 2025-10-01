import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiUrl } from './api';

export interface Category {
  id?: number;
  nom?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesUrl = apiUrl('/api/categories');

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(error);
      })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching category:', error);
        return throwError(error);
      })
    );
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.categoriesUrl, category).pipe(
      catchError(error => {
        console.error('Error creating category:', error);
        return throwError(error);
      })
    );
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.categoriesUrl}/${id}`, category).pipe(
      catchError(error => {
        console.error('Error updating category:', error);
        return throwError(error);
      })
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting category:', error);
        return throwError(error);
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiUrl } from './api';

export interface Product {
  id?: number;
  nom?: string;
  title?: string;
  description?: string;
  prix?: number;
  price?: number;
  stock?: number;
  image?: string;
  imageUrl?: string;
  categorieId?: number;
  category?: string;
  name?: string;
  originalPrice?: number;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  stockStatus?: string;
  categorie?: {
    id?: number;
    nom?: string;
  };
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = apiUrl('/api/produits');

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      map(products => products.map(this.mapBackendProduct)),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]); // Return empty array instead of mock data
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(
      map(product => this.mapBackendProduct(product)),
      catchError(error => {
        console.error('Error fetching product:', error);
        return of(null); // Return null instead of mock data
      })
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, this.mapFrontendProduct(product)).pipe(
      map(p => this.mapBackendProduct(p)),
      catchError(error => {
        console.error('Error creating product:', error);
        throw error;
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.productsUrl}/${id}`, this.mapFrontendProduct(product)).pipe(
      map(p => this.mapBackendProduct(p)),
      catchError(error => {
        console.error('Error updating product:', error);
        throw error;
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting product:', error);
        throw error;
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Product[]>(this.productsUrl, { params }).pipe(
      map(products => products.map(this.mapBackendProduct)),
      catchError(error => {
        console.error('Error searching products:', error);
        return of([]); // Return empty array instead of mock data
      })
    );
  }

  // Map backend product format to frontend format
  private mapBackendProduct(product: any): Product {
    return {
      ...product,
      name: product.nom || product.name || product.title,
      title: product.nom || product.title || product.name,
      price: product.prix || product.price,
      imageUrl: product.image || product.imageUrl || null, // Removed fallback image
      category: product.category || (product.categorie ? product.categorie.nom : '') || 'Uncategorized'
    };
  }

  // Map frontend product format to backend format
  private mapFrontendProduct(product: Product): any {
    return {
      ...product,
      nom: product.title || product.name || product.nom,
      prix: product.price || product.prix,
      image: product.imageUrl || product.image
    };
  }
}
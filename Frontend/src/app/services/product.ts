import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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
      map(products => products.map(product => this.mapBackendProduct(product))),
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(error); // Re-throw error instead of returning empty array
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(
      map(product => this.mapBackendProduct(product)),
      catchError(error => {
        console.error('Error fetching product:', error);
        return throwError(error); // Re-throw error instead of returning null
      })
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, this.mapFrontendProduct(product)).pipe(
      map(p => this.mapBackendProduct(p)),
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(error);
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.productsUrl}/${id}`, this.mapFrontendProduct(product)).pipe(
      map(p => this.mapBackendProduct(p)),
      catchError(error => {
        console.error('Error updating product:', error);
        return throwError(error);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting product:', error);
        return throwError(error);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Product[]>(this.productsUrl, { params }).pipe(
      map(products => products.map(product => this.mapBackendProduct(product))),
      catchError(error => {
        console.error('Error searching products:', error);
        return throwError(error); // Re-throw error instead of returning empty array
      })
    );
  }

  // Map backend product format to frontend format
  private mapBackendProduct(product: any): Product {
    if (!product) return {} as Product;
    
    // Map backend fields to frontend fields
    return {
      ...product,
      id: product['id'] !== undefined ? product['id'] : product['idProduit'],
      name: product['nom'] || product['name'] || product['title'] || 'Product',
      title: product['nom'] || product['title'] || product['name'] || 'Product',
      price: product['prix'] !== undefined ? product['prix'] : (product['price'] || 0),
      prix: product['prix'] !== undefined ? product['prix'] : (product['price'] || 0),
      image: product['image'] || product['imageUrl'] || '',
      imageUrl: product['image'] || product['imageUrl'] || '',
      // Handle category properly - could be a string or an object
      category: product['category'] || 
                (product['categorie'] && typeof product['categorie'] === 'object' ? product['categorie']['nom'] : product['categorie']) || 
                'Uncategorized'
    };
  }

  // Map frontend product format to backend format
  private mapFrontendProduct(product: Product): any {
    return {
      ...product,
      nom: product['title'] || product['name'] || product['nom'],
      prix: product['price'] || product['prix'],
      image: product['imageUrl'] || product['image'],
      // Handle category ID mapping
      categorieId: product['categorieId'] || (product['categorie'] ? product['categorie']['id'] : null)
    };
  }
}
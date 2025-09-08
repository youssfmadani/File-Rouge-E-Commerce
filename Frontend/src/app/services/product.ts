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
        return of(this.getMockProducts());
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(
      map(product => this.mapBackendProduct(product)),
      catchError(error => {
        console.error('Error fetching product:', error);
        return of(this.getMockProducts().find(p => p.id === id) || null);
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
        return of(this.getMockProducts().filter(p => 
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
        ));
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
      imageUrl: product.image || product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
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

  // Mock data for development/fallback
  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 199.99,
        originalPrice: 249.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=3840&h=2160&fit=crop&crop=center',
        category: 'Electronics',
        brand: 'AudioTech',
        rating: 4.8,
        reviewCount: 128,
        badge: 'Sale',
        stockStatus: 'in-stock',
        description: 'Experience crystal-clear sound with our premium wireless headphones featuring active noise cancellation and extended battery life.',
        stock: 50
      },
      {
        id: 2,
        name: 'Smart Fitness Watch',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=3840&h=2160&fit=crop&crop=center',
        category: 'Electronics',
        brand: 'FitTech',
        rating: 4.5,
        reviewCount: 89,
        badge: 'Hot',
        stockStatus: 'in-stock',
        description: 'Track your fitness goals with precision using our advanced smart watch with comprehensive health monitoring features.',
        stock: 25
      },
      {
        id: 3,
        name: 'Designer Backpack',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=3840&h=2160&fit=crop&crop=center',
        category: 'Fashion',
        brand: 'UrbanStyle',
        rating: 4.9,
        reviewCount: 56,
        badge: 'New',
        stockStatus: 'in-stock',
        description: 'Stay organized and stylish with our premium designer backpack featuring durable materials and smart storage solutions.',
        stock: 15
      }
    ];
  }
}

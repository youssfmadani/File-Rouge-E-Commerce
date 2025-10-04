import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { apiUrl } from './api';
import { CategoryService, Category } from './category';

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

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  getAllProducts(): Observable<Product[]> {
    return forkJoin({
      products: this.http.get<Product[]>(this.productsUrl).pipe(
        catchError(error => {
          return throwError(error);
        })
      ),
      categories: this.categoryService.getAllCategories().pipe(
        catchError(error => {
          return of([]);
        })
      )
    }).pipe(
      map(({ products, categories }) => {
        const categoryMap = new Map<number, string>();
        categories.forEach(category => {
          if (category.id !== undefined) {
            categoryMap.set(category.id, category.nom || 'Unknown Category');
          }
        });

        return products.map(product => this.mapBackendProduct(product, categoryMap));
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return forkJoin({
      product: this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(
        catchError(error => {
          return throwError(error);
        })
      ),
      categories: this.categoryService.getAllCategories().pipe(
        catchError(error => {
          return of([]);
        })
      )
    }).pipe(
      map(({ product, categories }) => {
        const categoryMap = new Map<number, string>();
        categories.forEach(category => {
          if (category.id !== undefined) {
            categoryMap.set(category.id, category.nom || 'Unknown Category');
          }
        });

        return this.mapBackendProduct(product, categoryMap);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  createProduct(product: Product): Observable<Product> {
    const backendProduct: any = {};
    
    const productName = product['nom'] || product['title'] || product['name'] || '';
    backendProduct.nom = productName.trim();
    
    const productDescription = product.description || '';
    backendProduct.description = productDescription.trim();
    
    backendProduct.prix = product['prix'] !== undefined ? Number(product['prix']) : 
                         (product['price'] !== undefined ? Number(product['price']) : 0);
    
    const productStock = product.stock !== undefined ? Number(product.stock) : 0;
    backendProduct.stock = isNaN(productStock) || productStock < 0 ? 0 : productStock;
    
    if (product['image']) {
      backendProduct.image = product['image'];
    } else if (product['imageUrl']) {
      backendProduct.image = product['imageUrl'];
    }
    
    if (product['categorieId'] !== undefined && product['categorieId'] !== null) {
      const categoryId = Number(product['categorieId']);
      if (!isNaN(categoryId) && categoryId > 0) {
        backendProduct.categorieId = categoryId;
      }
    } else if (product['categorie'] && typeof product['categorie'] === 'object' && product['categorie']['id']) {
      const categoryId = Number(product['categorie']['id']);
      if (!isNaN(categoryId) && categoryId > 0) {
        backendProduct.categorieId = categoryId;
      }
    }
    
    if (!backendProduct.nom) {
      return throwError(new Error('Product name is required.'));
    }
    
    if (!backendProduct.description) {
      return throwError(new Error('Product description is required.'));
    }
    
    return this.http.post<Product>(this.productsUrl, backendProduct).pipe(
      switchMap(p => {
        return this.categoryService.getAllCategories().pipe(
          map(categories => {
            const categoryMap = new Map<number, string>();
            categories.forEach(category => {
              if (category.id !== undefined) {
                categoryMap.set(category.id, category.nom || 'Unknown Category');
              }
            });
            return this.mapBackendProduct(p, categoryMap);
          })
        );
      }),
      catchError(error => {
        let errorMessage = 'Failed to create product';
        if (error.status === 400) {
          errorMessage = 'Invalid product data. Please check all fields are filled correctly.';
          if (error.error) {
            if (typeof error.error === 'string') {
              try {
                const errorObj = JSON.parse(error.error);
                if (errorObj.message) {
                  errorMessage += ' Details: ' + errorObj.message;
                } else {
                  errorMessage += ' Details: ' + error.error;
                }
              } catch (e) {
                errorMessage += ' Details: ' + error.error;
              }
            } else if (error.error.message) {
              errorMessage += ' Details: ' + error.error.message;
            } else if (typeof error.error === 'object') {
              const errorObj = error.error;
              if (errorObj.errors) {
                errorMessage += ' Details: ' + JSON.stringify(errorObj.errors);
              } else if (errorObj.error) {
                errorMessage += ' Details: ' + errorObj.error;
              } else if (errorObj.title) {
                errorMessage += ' Details: ' + errorObj.title;
              } else if (errorObj.message) {
                errorMessage += ' Details: ' + errorObj.message;
              } else {
                errorMessage += ' Details: ' + JSON.stringify(errorObj);
              }
            }
          }
        } else if (error.status === 404) {
          errorMessage = 'Product endpoint not found.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(new Error(errorMessage));
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const backendProduct: any = {};
    
    const productName = product['nom'] || product['title'] || product['name'] || '';
    backendProduct.nom = productName.trim();
    
    const productDescription = product.description || '';
    backendProduct.description = productDescription.trim();
    
    const productPrice = product['prix'] !== undefined ? Number(product['prix']) : 
                         (product['price'] !== undefined ? Number(product['price']) : 0);
    backendProduct.prix = isNaN(productPrice) ? 0 : productPrice;
    
    const productStock = product.stock !== undefined ? Number(product.stock) : 0;
    backendProduct.stock = isNaN(productStock) || productStock < 0 ? 0 : productStock;
    
    if (product['image']) {
      backendProduct.image = product['image'];
    } else if (product['imageUrl']) {
      backendProduct.image = product['imageUrl'];
    }
    
    if (product['categorieId'] !== undefined && product['categorieId'] !== null) {
      const categoryId = Number(product['categorieId']);
      if (!isNaN(categoryId) && categoryId > 0) {
        backendProduct.categorieId = categoryId;
      }
    } else if (product['categorie'] && typeof product['categorie'] === 'object' && product['categorie']['id']) {
      const categoryId = Number(product['categorie']['id']);
      if (!isNaN(categoryId) && categoryId > 0) {
        backendProduct.categorieId = categoryId;
      }
    }
    
    if (!backendProduct.nom) {
      return throwError(new Error('Product name is required.'));
    }
    
    if (!backendProduct.description) {
      return throwError(new Error('Product description is required.'));
    }
    
    return this.http.put<Product>(`${this.productsUrl}/${id}`, backendProduct).pipe(
      switchMap(p => {
        return this.categoryService.getAllCategories().pipe(
          map(categories => {
            const categoryMap = new Map<number, string>();
            categories.forEach(category => {
              if (category.id !== undefined) {
                categoryMap.set(category.id, category.nom || 'Unknown Category');
              }
            });
            return this.mapBackendProduct(p, categoryMap);
          })
        );
      }),
      catchError(error => {
        let errorMessage = 'Failed to update product';
        if (error.status === 400) {
          errorMessage = 'Invalid product data. Please check all fields are filled correctly.';
          if (error.error) {
            if (typeof error.error === 'string') {
              try {
                const errorObj = JSON.parse(error.error);
                if (errorObj.message) {
                  errorMessage += ' Details: ' + errorObj.message;
                } else {
                  errorMessage += ' Details: ' + error.error;
                }
              } catch (e) {
                errorMessage += ' Details: ' + error.error;
              }
            } else if (error.error.message) {
              errorMessage += ' Details: ' + error.error.message;
            } else if (typeof error.error === 'object') {
              const errorObj = error.error;
              if (errorObj.errors) {
                errorMessage += ' Details: ' + JSON.stringify(errorObj.errors);
              } else if (errorObj.error) {
                errorMessage += ' Details: ' + errorObj.error;
              } else if (errorObj.title) {
                errorMessage += ' Details: ' + errorObj.title;
              } else if (errorObj.message) {
                errorMessage += ' Details: ' + errorObj.message;
              } else {
                errorMessage += ' Details: ' + JSON.stringify(errorObj);
              }
            }
          }
        } else if (error.status === 404) {
          errorMessage = 'Product not found.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(new Error(errorMessage));
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Product[]>(this.productsUrl, { params }).pipe(
      switchMap(products => {
        return this.categoryService.getAllCategories().pipe(
          map(categories => {
            const categoryMap = new Map<number, string>();
            categories.forEach(category => {
              if (category.id !== undefined) {
                categoryMap.set(category.id, category.nom || 'Unknown Category');
              }
            });
            return products.map(product => this.mapBackendProduct(product, categoryMap));
          })
        );
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private mapBackendProduct(product: any, categoryMap?: Map<number, string>): Product {
    if (!product) return {} as Product;
    
    let categoryName = '';
    if (categoryMap && product['categorieId'] !== undefined && product['categorieId'] !== null) {
      categoryName = categoryMap.get(product['categorieId']) || '';
    } else if (product['category']) {
      categoryName = product['category'];
    } else if (product['categorie'] && typeof product['categorie'] === 'object') {
      categoryName = product['categorie']['nom'] || '';
    }
    
    return {
      ...product,
      id: product['id'] !== undefined ? product['id'] : product['idProduit'],
      name: product['nom'] || product['name'] || product['title'] || 'Product',
      title: product['nom'] || product['title'] || product['name'] || 'Product',
      price: product['prix'] !== undefined ? product['prix'] : (product['price'] || 0),
      prix: product['prix'] !== undefined ? product['prix'] : (product['price'] || 0),
      image: product['image'] || product['imageUrl'] || '',
      imageUrl: product['image'] || product['imageUrl'] || '',
      category: categoryName,
      categorie: product['categorieId'] !== undefined ? {
        id: product['categorieId'],
        nom: categoryName
      } : product['categorie']
    };
  }

  private mapFrontendProduct(product: Product): any {
    return product;
  }
}

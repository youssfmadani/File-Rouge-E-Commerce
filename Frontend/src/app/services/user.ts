import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { apiUrl } from './api';

export interface Adherent {
  id?: number;
  nom?: string;
  prénom?: string;
  prenom?: string;
  email?: string;
  motDePasse?: string;
  createdAt?: string;
  ordersCount?: number;
  wishlistCount?: number;
  rating?: number;
  recentOrders?: any[];
  wishlist?: any[];
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private adherentsUrl = apiUrl('/api/adherents');

  constructor(private http: HttpClient) {}

  getByEmail(email: string): Observable<Adherent | null> {
    // Try the new dedicated endpoint first
    return this.getByEmailAlt(email).pipe(
      switchMap(result => {
        if (result) {
          return of(result);
        }
        // Fallback to query parameter approach
        const params = new HttpParams().set('email', email);
        return this.http.get<Adherent[]>(this.adherentsUrl, { params }).pipe(
          map(adherents => adherents && adherents.length > 0 ? this.mapBackendAdherent(adherents[0]) : null),
          catchError(() => of(null))
        );
      }),
      catchError(() => of(this.getMockUser(email)))
    );
  }

  getByEmailAlt(email: string): Observable<Adherent | null> {
    // Use the dedicated endpoint: /api/adherents/email/{email}
    return this.http.get<Adherent>(apiUrl(`/api/adherents/email/${encodeURIComponent(email)}`)).pipe(
      map(adherent => this.mapBackendAdherent(adherent)),
      catchError(() => of(null))
    );
  }

  getById(id: number): Observable<Adherent | null> {
    return this.http.get<Adherent>(`${this.adherentsUrl}/${id}`).pipe(
      map(adherent => this.mapBackendAdherent(adherent)),
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return of(null);
      })
    );
  }

  getAllUsers(): Observable<Adherent[]> {
    return this.http.get<Adherent[]>(this.adherentsUrl).pipe(
      map(adherents => adherents.map(a => this.mapBackendAdherent(a))),
      catchError(error => {
        console.error('Error fetching all users:', error);
        return of([]);
      })
    );
  }

  createUser(adherent: Adherent): Observable<Adherent> {
    return this.http.post<Adherent>(this.adherentsUrl, this.mapFrontendAdherent(adherent)).pipe(
      map(a => this.mapBackendAdherent(a)),
      catchError(error => {
        console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  updateUser(id: number, adherent: Adherent): Observable<Adherent> {
    return this.http.put<Adherent>(`${this.adherentsUrl}/${id}`, this.mapFrontendAdherent(adherent)).pipe(
      map(a => this.mapBackendAdherent(a)),
      catchError(error => {
        console.error('Error updating user:', error);
        throw error;
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adherentsUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        throw error;
      })
    );
  }

  // Map backend adherent format to frontend format
  private mapBackendAdherent(adherent: any): Adherent {
    if (!adherent) return adherent;
    
    return {
      ...adherent,
      prenom: adherent.prénom || adherent.prenom,
      // Add computed fields for profile dashboard
      ordersCount: adherent.ordersCount || 0,
      wishlistCount: adherent.wishlistCount || 0,
      rating: adherent.rating || 4.5,
      recentOrders: adherent.recentOrders || [],
      wishlist: adherent.wishlist || []
    };
  }

  // Map frontend adherent format to backend format
  private mapFrontendAdherent(adherent: Adherent): any {
    return {
      ...adherent,
      prénom: adherent.prenom || adherent.prénom
    };
  }

  // Mock user for development/fallback
  private getMockUser(email: string): Adherent {
    return {
      id: 1,
      nom: 'Test',
      prénom: 'User',
      prenom: 'User',
      email: email,
      createdAt: '2024-01-01',
      ordersCount: 3,
      wishlistCount: 5,
      rating: 4.5,
      recentOrders: [
        {
          id: 1,
          title: 'Premium Wireless Headphones',
          date: '2024-01-15',
          status: 'delivered',
          total: 199.99,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
        },
        {
          id: 2,
          title: 'Smart Fitness Watch',
          date: '2024-01-10',
          status: 'shipped',
          total: 149.99,
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
        }
      ],
      wishlist: [
        {
          id: 4,
          title: 'Bluetooth Speaker',
          price: 79.99,
          imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop'
        },
        {
          id: 5,
          title: 'Wireless Earbuds',
          price: 59.99,
          imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop'
        }
      ]
    };
  }
}

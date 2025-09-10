import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiUrl } from './api';

export interface Order {
  id?: number;
  date?: string;
  status?: string;
  total?: number;
  adherentId?: number;
  produits?: any[];
  dateCommande?: string;
  statut?: string;
  montantTotal?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = apiUrl('/api/commandes');

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl).pipe(
      map(orders => orders.map(this.mapBackendOrder)),
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of(this.getMockOrders());
      })
    );
  }

  getOrderById(id: number): Observable<Order | null> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`).pipe(
      map(order => this.mapBackendOrder(order)),
      catchError(error => {
        console.error('Error fetching order:', error);
        return of(this.getMockOrders().find(o => o.id === id) || null);
      })
    );
  }

  getOrdersByAdherent(adherentId: number): Observable<Order[]> {
    const params = new HttpParams().set('adherentId', adherentId.toString());
    return this.http.get<Order[]>(this.ordersUrl, { params }).pipe(
      map(orders => orders.map(this.mapBackendOrder)),
      catchError(error => {
        console.error('Error fetching orders by adherent:', error);
        return of(this.getMockOrders().filter(o => o.adherentId === adherentId));
      })
    );
  }

  createOrder(order: Order): Observable<Order> {
    const mappedOrder = this.mapFrontendOrder(order);
    console.log('Creating order with data:', mappedOrder);
    
    return this.http.post<Order>(this.ordersUrl, mappedOrder).pipe(
      map(o => this.mapBackendOrder(o)),
      catchError(error => {
        console.error('Error creating order, using fallback:', error);
        console.error('Request data that failed:', mappedOrder);
        // Create a mock successful order for development/testing
        const mockOrder: Order = {
          ...order,
          id: Math.floor(Math.random() * 10000) + 1000, // Generate random ID
          date: new Date().toISOString(),
          status: 'pending'
        };
        console.log('Created mock order:', mockOrder);
        return of(mockOrder);
      })
    );
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.ordersUrl}/${id}`, this.mapFrontendOrder(order)).pipe(
      map(o => this.mapBackendOrder(o)),
      catchError(error => {
        console.error('Error updating order:', error);
        throw error;
      })
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ordersUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting order:', error);
        throw error;
      })
    );
  }

  // Map backend order format to frontend format
  private mapBackendOrder(order: any): Order {
    return {
      ...order,
      date: order.dateCommande || order.date,
      status: order.statut || order.status || 'pending',
      total: order.montantTotal || order.total || 0
    };
  }

  // Map frontend order format to backend format
  private mapFrontendOrder(order: Order): any {
    console.log('Mapping frontend order:', order);
    const mapped = {
      ...order,
      dateCommande: order.date || order.dateCommande,
      statut: order.status || order.statut,
      montantTotal: order.total || order.montantTotal
    };
    console.log('Mapped order result:', mapped);
    return mapped;
  }

  // Mock data for development/fallback
  private getMockOrders(): Order[] {
    return [
      {
        id: 1,
        date: '2024-01-15',
        status: 'delivered',
        total: 199.99,
        adherentId: 1,
        produits: [
          { id: 1, name: 'Premium Wireless Headphones', quantity: 1, price: 199.99 }
        ]
      },
      {
        id: 2,
        date: '2024-01-10',
        status: 'shipped',
        total: 149.99,
        adherentId: 1,
        produits: [
          { id: 2, name: 'Smart Fitness Watch', quantity: 1, price: 149.99 }
        ]
      },
      {
        id: 3,
        date: '2024-01-05',
        status: 'processing',
        total: 89.99,
        adherentId: 1,
        produits: [
          { id: 3, name: 'Designer Backpack', quantity: 1, price: 89.99 }
        ]
      }
    ];
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiUrl } from './api';

export interface Order {
  idCommande?: number;
  dateCommande?: Date;
  statut?: string;
  adherentId?: number;
  montantTotal?: number;
  adherent?: {
    id?: number;
    nom?: string;
    prénom?: string;
    email?: string;
  };
  produits?: any[];
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
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(error);
      })
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching order:', error);
        return throwError(error);
      })
    );
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.ordersUrl, order).pipe(
      catchError(error => {
        console.error('Error creating order:', error);
        return throwError(error);
      })
    );
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.ordersUrl}/${id}`, order).pipe(
      catchError(error => {
        console.error('Error updating order:', error);
        return throwError(error);
      })
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ordersUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting order:', error);
        return throwError(error);
      })
    );
  }
}
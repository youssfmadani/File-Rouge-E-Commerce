import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiUrl } from './api';

export interface OrderItem {
  id?: number;
  nom?: string;
  prix?: number;
  quantity?: number;
}

export interface Order {
  idCommande?: number;
  dateCommande?: Date | string;
  statut?: string;
  adherentId?: number;
  montantTotal?: number;
  adherent?: {
    id?: number;
    nom?: string;
    prénom?: string;
    email?: string;
  };
  produits?: OrderItem[];
  produitIds?: number[];
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
      catchError(this.handleError)
    );
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.ordersUrl}/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createOrder(order: Order): Observable<Order> {
    const orderData = this.prepareOrderData(order);
    return this.http.post<Order>(this.ordersUrl, orderData).pipe(
      catchError(this.handleError)
    );
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    const orderData = this.prepareOrderData(order);
    return this.http.put<Order>(`${this.ordersUrl}/${id}`, orderData).pipe(
      catchError(this.handleError)
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ordersUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private prepareOrderData(order: Order): any {
    const adherentId = order.adherentId || (order.adherent ? order.adherent.id : undefined);
    
    let formattedDate = order.dateCommande;
    if (order.dateCommande instanceof Date) {
      formattedDate = order.dateCommande.toISOString();
    } else if (typeof order.dateCommande === 'string') {
      const dateObj = new Date(order.dateCommande);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString();
      }
    }
    
    const preparedData = {
      dateCommande: formattedDate,
      statut: order.statut || 'EN_COURS',
      adherentId: adherentId,
      montantTotal: order.montantTotal !== undefined ? order.montantTotal : null,
      produitIds: order.produitIds || (order.produits ? order.produits.map(p => p?.id).filter(id => id !== undefined) : [])
    };
    
    return preparedData;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
      
      switch (error.status) {
        case 400:
          if (error.error && error.error.message) {
            errorMessage = `Bad Request - ${error.error.message}`;
          } else {
            errorMessage = 'Bad Request - Please check your input data';
          }
          break;
        case 401:
          errorMessage = 'Unauthorized - Please log in again';
          break;
        case 403:
          errorMessage = 'Forbidden - You do not have permission to perform this action';
          break;
        case 404:
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = 'Order not found - The requested order could not be found. It may have been deleted or is corrupted.';
          }
          break;
        case 500:
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = 'Internal Server Error - Please try again later';
          }
          break;
        default:
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          break;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
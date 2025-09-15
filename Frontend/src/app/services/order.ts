import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
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
  produitIds?: number[];
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
        return of([]); // Return empty array instead of mock data
      })
    );
  }

  getOrderById(id: number): Observable<Order | null> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`).pipe(
      map(order => this.mapBackendOrder(order)),
      catchError(error => {
        console.error('Error fetching order:', error);
        return of(null); // Return null instead of mock data
      })
    );
  }

  getOrdersByAdherent(adherentId: number): Observable<Order[]> {
    const params = new HttpParams().set('adherentId', adherentId.toString());
    return this.http.get<Order[]>(this.ordersUrl, { params }).pipe(
      map(orders => orders.map(this.mapBackendOrder)),
      catchError(error => {
        console.error('Error fetching orders by adherent:', error);
        return of([]); // Return empty array instead of mock data
      })
    );
  }

  createOrder(order: Order): Observable<Order> {
    try {
      // Ensure we're using the correct mapping
      const mappedOrder = this.mapFrontendOrder(order);
      console.log('Creating order with data:', mappedOrder);
      
      // Log the raw JSON being sent
      const rawJson = JSON.stringify(mappedOrder, null, 2);
      console.log('Raw JSON being sent:', rawJson);
      
      // Validate the mapped order one more time before sending
      this.validateMappedOrder(mappedOrder);
      
      // Set proper headers
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      
      // Log the complete request
      console.log('Complete request:', {
        url: this.ordersUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: mappedOrder
      });
      
      return this.http.post<Order>(this.ordersUrl, mappedOrder, { headers }).pipe(
        map(response => {
          console.log('Order creation response:', response);
          return this.mapBackendOrder(response);
        }),
        catchError(error => {
          console.error('Error creating order:', error);
          console.error('Request data that failed:', mappedOrder);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          if (error.error) {
            console.error('Error details:', error.error);
          }
          
          // Provide more specific error messages
          let errorMessage = 'Failed to place order. Please try again.';
          if (error.status === 400) {
            errorMessage = 'Invalid order data. Please check all fields and try again.';
            // If we have specific validation errors from the backend, include them
            if (error.error && typeof error.error === 'object') {
              // Check if this is a validation error response
              if (error.error.error) {
                // More specific error message from backend
                errorMessage = error.error.message || `Invalid order data: ${error.error.error}`;
              } else {
                const validationErrors = Object.keys(error.error);
                if (validationErrors.length > 0) {
                  // If it's a validation error with specific field messages
                  if (validationErrors.some(key => typeof error.error[key] === 'string')) {
                    errorMessage = `Invalid order data: ${validationErrors.map(key => `${key}: ${error.error[key]}`).join(', ')}`;
                  } else if (error.error.message) {
                    // If it's a general error message
                    errorMessage = `Invalid order data: ${error.error.message}`;
                  }
                }
              }
            }
            // If we don't have specific error details, provide a more general message
            if (errorMessage === 'Invalid order data. Please check all fields and try again.') {
              // Check if the error is related to adherent ID
              if (mappedOrder.adherentId) {
                errorMessage = `Invalid order data. The user with ID ${mappedOrder.adherentId} does not exist. Please log out and log in again.`;
              } else {
                errorMessage = 'Invalid order data. This might be due to an invalid user ID. Please log out and log in again.';
              }
            }
          } else if (error.status === 401) {
            errorMessage = 'Authentication required. Please log in and try again.';
          } else if (error.status === 404) {
            errorMessage = 'Order service not found. Please try again later.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          // Create a custom error with more details
          const customError = new Error(errorMessage);
          (customError as any)['originalError'] = error;
          (customError as any)['requestData'] = mappedOrder;
          (customError as any)['requestJson'] = rawJson;
          throw customError; // Re-throw the error instead of creating mock order
        })
      );
    } catch (error) {
      console.error('Error in createOrder method:', error);
      throw error;
    }
  }
  
  // Additional validation method
  private validateMappedOrder(mappedOrder: any): void {
    console.log('Validating mapped order:', mappedOrder);
    
    // Check that all required fields are present and have correct types
    if (mappedOrder.adherentId === undefined || mappedOrder.adherentId === null) {
      throw new Error('adherentId is missing or null');
    }
    
    if (typeof mappedOrder.adherentId !== 'number') {
      throw new Error('adherentId must be a number');
    }
    
    if (mappedOrder.adherentId <= 0) {
      throw new Error('adherentId must be positive');
    }
    
    if (mappedOrder.statut === undefined || mappedOrder.statut === null) {
      throw new Error('statut is missing or null');
    }
    
    if (typeof mappedOrder.statut !== 'string') {
      throw new Error('statut must be a string');
    }
    
    if (mappedOrder.statut.trim() === '') {
      throw new Error('statut cannot be empty');
    }
    
    if (mappedOrder.dateCommande === undefined || mappedOrder.dateCommande === null) {
      throw new Error('dateCommande is missing or null');
    }
    
    if (typeof mappedOrder.dateCommande !== 'string') {
      throw new Error('dateCommande must be a string');
    }
    
    if (mappedOrder.produitIds === undefined || mappedOrder.produitIds === null) {
      throw new Error('produitIds is missing or null');
    }
    
    if (!Array.isArray(mappedOrder.produitIds)) {
      throw new Error('produitIds must be an array');
    }
    
    if (mappedOrder.produitIds.length === 0) {
      throw new Error('produitIds cannot be empty');
    }
    
    if (mappedOrder.produitIds.some((id: any) => typeof id !== 'number' || id <= 0)) {
      throw new Error('All produitIds must be positive numbers');
    }
    
    console.log('Mapped order validation passed');
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    const mappedOrder = this.mapFrontendOrder(order);
    console.log('Updating order with data:', mappedOrder);
    
    // Log the raw JSON being sent
    console.log('Raw JSON being sent for update:', JSON.stringify(mappedOrder, null, 2));
    
    return this.http.put<Order>(`${this.ordersUrl}/${id}`, mappedOrder).pipe(
      map(o => this.mapBackendOrder(o)),
      catchError(error => {
        console.error('Error updating order:', error);
        console.error('Request data that failed:', mappedOrder);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        if (error.error) {
          console.error('Error details:', error.error);
        }
        // Return the original order with an error flag so the UI can handle it
        return of({ ...order, error: true });
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
    // Calculate total from produits if not provided
    let total = order.montantTotal || order.total || 0;
    
    // If we have produits, calculate total from them
    if (!total && order.produits && Array.isArray(order.produits)) {
      total = order.produits.reduce((sum: number, produit: any) => {
        const price = produit.prix || produit.price || 0;
        const quantity = produit.quantite || produit.quantity || 1;
        return sum + (price * quantity);
      }, 0);
    }
    
    return {
      ...order,
      id: order.idCommande || order.id, // Map idCommande to id if needed
      date: order.dateCommande || order.date,
      dateCommande: order.dateCommande || order.date,
      status: order.statut || order.status || 'EN_COURS',
      statut: order.statut || order.status || 'EN_COURS',
      total: total,
      montantTotal: order.montantTotal || order.total || 0,
      adherentId: order.adherentId || (order.adherent ? order.adherent.id : undefined),
      produitIds: order.produitIds || (order.produits ? order.produits.map((p: any) => p.idProduit || p.id) : undefined),
      produits: order.produits
    };
  }

  // Map frontend order format to backend format
  private mapFrontendOrder(order: Order): any {
    console.log('Mapping frontend order:', order);
    
    // Validate required fields with better error messages
    if (order.adherentId === undefined || order.adherentId === null) {
      throw new Error('Adherent ID is required to create an order. Please ensure you are logged in.');
    }
    
    // Use produitIds if available, otherwise create empty array
    const produitIds = order.produitIds && Array.isArray(order.produitIds) 
      ? order.produitIds.map(id => Number(id)).filter(id => !isNaN(id) && id > 0)
      : [];
    
    // Format the date properly for the backend
    let formattedDate = order.dateCommande || order.date;
    if (formattedDate) {
      // If it's already a string, make sure it's in the right format
      if (typeof formattedDate === 'string') {
        // Try to parse it as a date and reformat it
        const dateObj = new Date(formattedDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString();
        } else {
          throw new Error('Invalid date format. Please provide a valid date.');
        }
      } else {
        // Handle Date objects
        const dateObj = formattedDate as Date;
        if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString();
        }
      }
    } else {
      // Default to current date if not provided
      formattedDate = new Date().toISOString();
    }
    
    // Validate status is not empty
    const status = order.statut || order.status || 'EN_COURS';
    if (!status || status.trim() === '') {
      throw new Error('Order status is required.');
    }
    
    // Handle montantTotal - ensure it's a valid number
    let montantTotal = order.montantTotal || order.total || 0;
    if (typeof montantTotal !== 'number' || isNaN(montantTotal)) {
      montantTotal = 0;
    }
    
    // Round to 2 decimal places to avoid floating point precision issues
    montantTotal = Math.round(montantTotal * 100) / 100;
    
    // Send data in the exact format expected by the backend (CommandeDTO)
    const mapped: any = {
      adherentId: Number(order.adherentId),
      montantTotal: montantTotal,
      statut: status, // Use 'statut' not 'status'
      dateCommande: formattedDate,
      produitIds: produitIds
    };
    
    // Validate that all required fields are present
    if (mapped.adherentId === undefined || mapped.adherentId === null) {
      throw new Error('adherentId is required');
    }
    
    if (mapped.statut === undefined || mapped.statut === null || mapped.statut.trim() === '') {
      throw new Error('statut is required');
    }
    
    if (mapped.dateCommande === undefined || mapped.dateCommande === null) {
      throw new Error('dateCommande is required');
    }
    
    // Remove undefined properties
    Object.keys(mapped).forEach(key => {
      if (mapped[key] === undefined) {
        delete mapped[key];
      }
    });
    
    console.log('Mapped order result:', mapped);
    return mapped;
  }


}
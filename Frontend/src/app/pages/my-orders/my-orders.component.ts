import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  sortField: keyof Order = 'idCommande';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'User not authenticated. Please log in.';
      this.loading = false;
      return;
    }
    
    this.orderService.getOrdersByUserId(currentUser.id).subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.applySorting();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.message || 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  searchOrders(): void {
    if (!this.searchTerm) {
      this.filteredOrders = [...this.orders];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(order => 
        (order.idCommande?.toString().includes(term)) ||
        (order.statut?.toLowerCase().includes(term)) ||
        (order.montantTotal?.toString().includes(term))
      );
    }
    this.applySorting();
  }

  viewOrderDetails(id: number | undefined): void {
    if (id === undefined) {
      return;
    }
  }

  sortOrders(field: keyof Order): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }
  
  private applySorting(): void {
    this.filteredOrders.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  
  getStatusLabel(status: string | undefined): string {
    const statusMap: { [key: string]: string } = {
      'EN_COURS': 'En cours',
      'EXPEDIE': 'Expédié',
      'LIVRE': 'Livré',
      'ANNULE': 'Annulé'
    };
    return status ? statusMap[status] || status : 'Unknown';
  }
  
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      return dateObj.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  }
  
  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return 'N/A';
    return `$${amount.toFixed(2)}`;
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../services/order.service';
import { AdminSidebarComponent } from '../../admin/admin-sidebar';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebarComponent],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
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
    
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.applySorting();
        this.loading = false;
        
        const corruptedOrders = this.getCorruptedOrders();
        if (corruptedOrders.length > 0) {
        }
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
        (order.adherent?.nom?.toLowerCase().includes(term)) ||
        (order.adherent?.['prénom']?.toLowerCase().includes(term)) ||
        (order.montantTotal?.toString().includes(term))
      );
    }
    this.applySorting();
  }

  deleteOrder(id: number | undefined): void {
    if (id === undefined) {
      return;
    }
    
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.idCommande !== id);
          this.filteredOrders = this.filteredOrders.filter(order => order.idCommande !== id);
        },
        error: (error: any) => {
          if (error.message && error.message.includes('Order not found')) {
            this.orders = this.orders.filter(order => order.idCommande !== id);
            this.filteredOrders = this.filteredOrders.filter(order => order.idCommande !== id);
            this.error = 'Order was corrupted and has been removed from the list.';
          } else {
            this.error = error.message || 'Failed to delete order';
          }
        }
      });
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/orders/create']);
  }

  navigateToEdit(id: number | undefined): void {
    if (id === undefined) {
      return;
    }
    
    const order = this.orders.find(o => o.idCommande === id);
    if (order && this.isOrderCorrupted(order)) {
      if (confirm('This order appears to be corrupted or incomplete. Do you still want to edit it?')) {
        this.router.navigate(['/admin/orders/edit', id]);
      }
    } else {
      this.router.navigate(['/admin/orders/edit', id]);
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
  
  getCustomerName(order: Order): string {
    if (!order.adherent) return 'N/A';
    const firstName = order.adherent['prénom'] || '';
    const lastName = order.adherent.nom || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  }

  isOrderCorrupted(order: Order): boolean {
    return !order.dateCommande || !order.statut || !order.adherent;
  }

  getCorruptedOrders(): Order[] {
    return this.orders.filter(order => this.isOrderCorrupted(order));
  }

  suggestBackendFix(): void {
    const corruptedOrders = this.getCorruptedOrders();
    if (corruptedOrders.length > 0) {
    }
  }
}
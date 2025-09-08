import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../services/order';

@Component({
  selector: 'app-order-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-crud.html',
  styleUrls: ['./order-crud.css']
})
export class OrderCrud implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Search and filter
  searchTerm = '';
  selectedStatus = '';
  statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  // Form states
  showDetailsModal = false;
  selectedOrder: Order | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Failed to load orders';
        this.isLoading = false;
      }
    });
  }

  // Search and filter methods
  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        (order.id && order.id.toString().includes(this.searchTerm)) ||
        (order['customerName'] && order['customerName'].toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (order['customerEmail'] && order['customerEmail'].toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = !this.selectedStatus || 
        (order.status && order.status.toLowerCase() === this.selectedStatus.toLowerCase());
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.filterOrders();
  }

  onStatusChange(): void {
    this.filterOrders();
  }

  // Order management
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  hideDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    if (order.id) {
      const updatedOrder = { ...order, status: newStatus };
      
      this.orderService.updateOrder(order.id, updatedOrder).subscribe({
        next: () => {
          this.successMessage = `Order status updated to ${newStatus}`;
          this.loadOrders();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error updating order status:', error);
          this.errorMessage = 'Failed to update order status';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  deleteOrder(order: Order): void {
    if (confirm(`Are you sure you want to delete order #${order.id}?`)) {
      if (order.id) {
        this.orderService.deleteOrder(order.id).subscribe({
          next: () => {
            this.successMessage = 'Order deleted successfully';
            this.loadOrders();
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error deleting order:', error);
            this.errorMessage = 'Failed to delete order';
            setTimeout(() => this.errorMessage = '', 3000);
          }
        });
      }
    }
  }

  // Utility methods
  getOrderTotal(order: Order): number {
    return order.total || order['totalAmount'] || 0;
  }

  getOrderDate(order: Order): string {
    const date = order['orderDate'] || order['createdAt'] || order.date;
    if (!date) return 'N/A';
    
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    
    return 'N/A';
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-pending';
    
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'delivered':
      case 'completed':
        return 'status-delivered';
      case 'shipped':
      case 'shipping':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
      case 'canceled':
        return 'status-cancelled';
      case 'pending':
      default:
        return 'status-pending';
    }
  }

  getStatusText(status: string): string {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  getCustomerName(order: Order): string {
    return order['customerName'] || order['customer']?.name || 'Unknown Customer';
  }

  getCustomerEmail(order: Order): string {
    return order['customerEmail'] || order['customer']?.email || 'No email';
  }
}
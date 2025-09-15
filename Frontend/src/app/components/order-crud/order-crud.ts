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
  isCreatingOrder = false;
  errorMessage = '';
  successMessage = '';
  
  // Search and filter
  searchTerm = '';
  selectedStatus = '';
  statusOptions = ['EN_COURS', 'VALIDÉE', 'ANNULÉE'];
  
  // Form states
  showDetailsModal = false;
  showCreateForm = false;
  selectedOrder: Order | null = null;
  newOrder: Order = {
    adherentId: undefined,
    total: undefined,
    status: 'EN_COURS', // Default to EN_COURS
    dateCommande: new Date().toISOString().split('T')[0], // Default to today
    produitIds: [] // Initialize with empty array
  };
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

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
        this.filteredOrders = [...orders];
        this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
        this.filterOrders();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again later.';
        this.orders = [];
        this.filteredOrders = [];
        this.totalPages = 0;
        this.filterOrders();
        this.isLoading = false;
      }
    });
  }

  // Search and filter methods
  filterOrders(): void {
    let filtered = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        (order.id && order.id.toString().includes(this.searchTerm)) ||
        (order['customerName'] && order['customerName'].toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (order['customerEmail'] && order['customerEmail'].toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (order.adherentId && order.adherentId.toString().includes(this.searchTerm));
      
      const matchesStatus = !this.selectedStatus || 
        (order.status && order.status.toLowerCase() === this.selectedStatus.toLowerCase());
      
      return matchesSearch && matchesStatus;
    });
    
    // Update pagination
    this.filteredOrders = filtered;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filtering
  }

  onSearchChange(): void {
    this.filterOrders();
  }

  onStatusChange(): void {
    this.filterOrders();
  }

  // Pagination methods
  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
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
      // Use 'statut' for backend compatibility
      const updatedOrder = { ...order, statut: newStatus };
      
      this.orderService.updateOrder(order.id, updatedOrder).subscribe({
        next: (result) => {
          // Check if there was an error in the result
          if (result['error']) {
            console.error('Error updating order status');
            this.errorMessage = 'Failed to update order status';
            setTimeout(() => this.errorMessage = '', 3000);
            return;
          }
          
          console.log('Order status updated successfully:', result);
          this.successMessage = `Order status updated to ${this.getStatusText(newStatus)}`;
          // Update the order in the local array
          const index = this.orders.findIndex(o => o.id === order.id);
          if (index !== -1) {
            this.orders[index] = { ...this.orders[index], statut: newStatus, status: newStatus };
            // Also update in filtered orders if it's currently displayed
            const filteredIndex = this.filteredOrders.findIndex(o => o.id === order.id);
            if (filteredIndex !== -1) {
              this.filteredOrders[filteredIndex] = { ...this.filteredOrders[filteredIndex], statut: newStatus, status: newStatus };
            }
          }
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
    if (confirm(`Are you sure you want to delete order #${order.id}? This action cannot be undone.`)) {
      if (order.id) {
        console.log('Attempting to delete order with ID:', order.id);
        this.orderService.deleteOrder(order.id).subscribe({
          next: () => {
            console.log('Order deleted successfully');
            this.successMessage = 'Order deleted successfully';
            // Remove the order from the local arrays
            this.orders = this.orders.filter(o => o.id !== order.id);
            this.filteredOrders = this.filteredOrders.filter(o => o.id !== order.id);
            // Update pagination
            this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
            // If we're on the last page and it's now empty, go to previous page
            if (this.currentPage > this.totalPages && this.totalPages > 0) {
              this.currentPage = this.totalPages;
            } else if (this.totalPages === 0) {
              this.currentPage = 1;
            }
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error deleting order:', error);
            // Check if it's a 404 error (order not found)
            if (error.status === 404) {
              this.errorMessage = 'Order not found. It may have already been deleted.';
              // Remove the order from local arrays anyway
              this.orders = this.orders.filter(o => o.id !== order.id);
              this.filteredOrders = this.filteredOrders.filter(o => o.id !== order.id);
              this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
              if (this.currentPage > this.totalPages && this.totalPages > 0) {
                this.currentPage = this.totalPages;
              } else if (this.totalPages === 0) {
                this.currentPage = 1;
              }
            } else if (error.status === 500) {
              this.errorMessage = 'Server error. Failed to delete order. Please try again later.';
            } else {
              this.errorMessage = `Failed to delete order. Error: ${error.status} ${error.statusText}`;
            }
            setTimeout(() => this.errorMessage = '', 3000);
          }
        });
      } else {
        console.error('Cannot delete order: Order ID is missing');
        this.errorMessage = 'Cannot delete order: Order ID is missing';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    }
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  // Create order methods
  showCreateOrderForm(): void {
    this.showCreateForm = true;
    // Reset the form with default values
    this.newOrder = {
      adherentId: undefined,
      total: undefined,
      status: 'EN_COURS', // Keep 'status' for frontend display
      dateCommande: new Date().toISOString().split('T')[0],
      produitIds: []
    };
  }

  hideCreateOrderForm(): void {
    this.showCreateForm = false;
  }

  createOrder(): void {
    // Validate required fields more thoroughly
    console.log('Validating order data:', this.newOrder);
    
    if (!this.newOrder.adherentId || this.newOrder.adherentId <= 0) {
      this.errorMessage = 'Please enter a valid customer ID';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (!this.newOrder.total || this.newOrder.total <= 0) {
      this.errorMessage = 'Please enter a valid total amount';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (!this.newOrder.dateCommande) {
      this.errorMessage = 'Please select an order date';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (!this.newOrder.status) {
      this.errorMessage = 'Please select an order status';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.isCreatingOrder = true;
    this.errorMessage = '';

    // Ensure date is in proper format
    let orderDate = this.newOrder.dateCommande;
    if (orderDate && !orderDate.includes('T')) {
      orderDate = new Date(orderDate).toISOString();
    }

    // Create a clean order object with validated data and default values
    // Use 'statut' and 'montantTotal' for backend compatibility
    const cleanOrder: Order = {
      adherentId: this.newOrder.adherentId,
      montantTotal: this.newOrder.total,
      statut: this.newOrder.status || 'EN_COURS',
      dateCommande: orderDate || new Date().toISOString(),
      produitIds: this.newOrder['produitIds'] || []
    };

    console.log('Sending clean order data:', cleanOrder);

    this.orderService.createOrder(cleanOrder).subscribe({
      next: (createdOrder) => {
        console.log('Order created successfully:', createdOrder);
        this.successMessage = 'Order created successfully';
        this.hideCreateOrderForm();
        this.loadOrders(); // Refresh the orders list
        this.isCreatingOrder = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.errorMessage = 'Failed to create order. Please check the data and try again.';
        this.isCreatingOrder = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // Utility methods
  getOrderTotal(order: Order): number {
    return order.total || order['montantTotal'] || 0;
  }

  getOrderDate(order: Order): string {
    const dateValue: string | undefined = order.dateCommande || order.date;
    if (!dateValue) return 'N/A';
    
    const parsedDate = new Date(dateValue);
    return isNaN(parsedDate.getTime()) ? 'N/A' : parsedDate.toLocaleDateString();
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-pending';
    
    switch (status) {
      case 'VALIDÉE':
        return 'status-delivered';
      case 'EN_COURS':
        return 'status-processing';
      case 'ANNULÉE':
        return 'status-cancelled';
      case 'pending':
      default:
        return 'status-pending';
    }
  }

  getStatusText(status: string): string {
    if (!status) return 'Pending';
    
    switch (status) {
      case 'VALIDÉE':
        return 'Validée';
      case 'EN_COURS':
        return 'En Cours';
      case 'ANNULÉE':
        return 'Annulée';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  }

  getCustomerName(order: Order): string {
    // Extract customer name from adherent object
    if (order['adherent']) {
      const adherent = order['adherent'];
      const firstName = adherent['prénom'] || adherent['prenom'] || '';
      const lastName = adherent['nom'] || '';
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
    }
    
    // Fallback to other possible fields
    return order['customerName'] || order['customer']?.name || 'Unknown Customer';
  }

  getCustomerEmail(order: Order): string {
    // Extract customer email from adherent object
    if (order['adherent'] && order['adherent']['email']) {
      return order['adherent']['email'];
    }
    
    // Fallback to other possible fields
    return order['customerEmail'] || order['customer']?.email || 'No email';
  }
  
  // Get status options for dropdown
  getStatusOptions(): string[] {
    return ['EN_COURS', 'VALIDÉE', 'ANNULÉE'];
  }
}
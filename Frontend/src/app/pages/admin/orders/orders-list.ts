import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../services/order';
import { AdminSidebarComponent } from '../../admin/admin-sidebar';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebarComponent],
  templateUrl: './orders-list.html',
  styleUrls: ['./orders-list.css']
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  searchOrders(): void {
    // Implement search functionality if needed
    // For now, we'll just reload all orders
    this.loadOrders();
  }

  deleteOrder(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          // Remove the order from the list
          this.orders = this.orders.filter(order => order.idCommande !== id);
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          this.error = 'Failed to delete order';
        }
      });
    }
  }

  navigateToEdit(id: number | undefined): void {
    if (id === undefined) return;
    this.router.navigate(['/admin/orders/edit', id]);
  }
}
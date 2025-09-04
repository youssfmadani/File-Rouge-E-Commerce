import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { OrderService, Order } from '../../services/order';
import { UserService, Adherent } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  // Dashboard statistics
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  };

  // Recent data for dashboard overview
  recentProducts: Product[] = [];
  recentOrders: Order[] = [];
  recentUsers: Adherent[] = [];

  // Loading states
  isLoading = {
    products: false,
    orders: false,
    users: false
  };

  // Error handling
  errorMessage = '';

  constructor(
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // Load all dashboard data
  private loadDashboardData(): void {
    this.loadProducts();
    this.loadOrders();
    this.loadUsers();
  }

  // Load products data
  private loadProducts(): void {
    this.isLoading.products = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.stats.totalProducts = products.length;
        this.recentProducts = products.slice(0, 5); // Get latest 5
        this.isLoading.products = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.products = false;
      }
    });
  }

  // Load orders data
  private loadOrders(): void {
    this.isLoading.orders = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.stats.totalOrders = orders.length;
        this.stats.totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        this.recentOrders = orders.slice(0, 5); // Get latest 5
        this.isLoading.orders = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading.orders = false;
      }
    });
  }

  // Load users data
  private loadUsers(): void {
    this.isLoading.users = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.stats.totalUsers = users.length;
        this.recentUsers = users.slice(0, 5); // Get latest 5
        this.isLoading.users = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading.users = false;
      }
    });
  }

  // Navigation methods
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToOrders(): void {
    // For now, just show message - implement order management later
    alert('Order management functionality coming soon!');
  }

  navigateToUsers(): void {
    // For now, just show message - implement user management later
    alert('User management functionality coming soon!');
  }

  // Logout function
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Helper methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  }
}

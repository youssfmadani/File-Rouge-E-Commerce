import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdherentService, Adherent } from '../../services/adherent';
import { OrderService, Order } from '../../services/order.service';
import { CategoryService, Category } from '../../services/category';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  adherents: Adherent[] = [];
  orders: Order[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  
  adherentsLoading = true;
  ordersLoading = true;
  categoriesLoading = true;
  productsLoading = true;
  
  adherentsError: string | null = null;
  ordersError: string | null = null;
  categoriesError: string | null = null;
  productsError: string | null = null;

  constructor(
    private router: Router,
    private adherentService: AdherentService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadAdherents();
    this.loadOrders();
    this.loadCategories();
    this.loadProducts();
  }

  loadAdherents(): void {
    this.adherentsLoading = true;
    this.adherentsError = null;
    
    this.adherentService.getAllAdherents().subscribe({
      next: (adherents) => {
        this.adherents = adherents;
        this.adherentsLoading = false;
      },
      error: (error) => {
        this.adherentsError = 'Failed to load adherents';
        this.adherentsLoading = false;
      }
    });
  }

  loadOrders(): void {
    this.ordersLoading = true;
    this.ordersError = null;
    
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ordersLoading = false;
      },
      error: (error) => {
        this.ordersError = 'Failed to load orders';
        this.ordersLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoriesLoading = true;
    this.categoriesError = null;
    
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoriesLoading = false;
      },
      error: (error) => {
        this.categoriesError = 'Failed to load categories';
        this.categoriesLoading = false;
      }
    });
  }

  loadProducts(): void {
    this.productsLoading = true;
    this.productsError = null;
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.productsLoading = false;
      },
      error: (error) => {
        this.productsError = 'Failed to load products';
        this.productsLoading = false;
      }
    });
  }

  navigateToAdherents(): void {
    this.router.navigate(['/admin/adherents']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/admin/orders']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/admin/categories']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/admin/products']);
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
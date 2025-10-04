import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../services/order.service';
import { AdminSidebarComponent } from '../../admin/admin-sidebar';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebarComponent],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  order: Order = {
    dateCommande: new Date(),
    statut: 'EN_COURS',
    adherentId: undefined,
    montantTotal: 0,
    produitIds: []
  };
  isEditMode = false;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Status options for the dropdown
  statusOptions = [
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'EXPEDIE', label: 'Expédié' },
    { value: 'LIVRE', label: 'Livré' },
    { value: 'ANNULE', label: 'Annulé' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadOrder(parseInt(id, 10));
    }
  }

  /**
   * Load an existing order for editing
   * @param id - The ID of the order to load
   */
  loadOrder(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.orderService.getOrderById(id).subscribe({
      next: (order: Order) => {
        console.log('Loaded order data:', order);
        // Ensure date is a Date object
        if (order.dateCommande && typeof order.dateCommande === 'string') {
          order.dateCommande = new Date(order.dateCommande);
        }
        this.order = { ...order }; // Create a copy to avoid reference issues
        this.loading = false;
        console.log('Processed order data:', this.order);
      },
      error: (error: any) => {
        console.error('Error loading order:', error);
        // Check if it's a specific error message from the backend
        if (error.message) {
          this.error = error.message;
        } else {
          this.error = 'Failed to load order. Please try again or contact support.';
        }
        this.loading = false;
      }
    });
  }

  /**
   * Handle form submission for create/update
   */
  onSubmit(): void {
    // Clear previous messages
    this.error = null;
    this.successMessage = null;
    
    // Validate required fields
    if (!this.validateOrder()) {
      return;
    }
    
    this.loading = true;

    if (this.isEditMode) {
      // Update existing order
      if (this.order.idCommande) {
        // Create a copy of the order to avoid modifying the original
        const orderToUpdate = { ...this.order };
        
        // Ensure date is properly formatted
        if (orderToUpdate.dateCommande instanceof Date) {
          orderToUpdate.dateCommande = orderToUpdate.dateCommande.toISOString();
        }
        
        console.log('Updating order with data:', orderToUpdate);
        
        this.orderService.updateOrder(this.order.idCommande, orderToUpdate).subscribe({
          next: (updatedOrder: Order) => {
            this.loading = false;
            this.successMessage = 'Order updated successfully!';
            console.log('Order updated successfully:', updatedOrder);
            // Redirect after a short delay to show success message
            setTimeout(() => {
              this.router.navigate(['/admin/orders']);
            }, 2000);
          },
          error: (error: any) => {
            console.error('Error updating order:', error);
            // Check if it's a specific error message from the backend
            if (error.message) {
              this.error = error.message;
            } else {
              this.error = 'Failed to update order. Please check your input data and try again.';
            }
            this.loading = false;
          }
        });
      }
    } else {
      // Create new order
      // Create a copy of the order to avoid modifying the original
      const orderToCreate = { ...this.order };
      
      // Ensure date is properly formatted
      if (orderToCreate.dateCommande instanceof Date) {
        orderToCreate.dateCommande = orderToCreate.dateCommande.toISOString();
      }
      
      console.log('Creating order with data:', orderToCreate);
      
      this.orderService.createOrder(orderToCreate).subscribe({
        next: (newOrder: Order) => {
          this.loading = false;
          this.successMessage = 'Order created successfully!';
          console.log('Order created successfully:', newOrder);
          // Redirect after a short delay to show success message
          setTimeout(() => {
            this.router.navigate(['/admin/orders']);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Error creating order:', error);
          // Check if it's a specific error message from the backend
          if (error.message) {
            this.error = error.message;
          } else {
            this.error = 'Failed to create order. Please check your input data and try again.';
          }
          this.loading = false;
        }
      });
    }
  }

  /**
   * Validate order data before submission
   * @returns boolean indicating if validation passed
   */
  private validateOrder(): boolean {
    if (!this.order.dateCommande) {
      this.error = 'Order date is required';
      return false;
    }
    
    if (!this.order.statut) {
      this.error = 'Order status is required';
      return false;
    }
    
    if (this.order.adherentId === undefined || this.order.adherentId === null) {
      this.error = 'Customer ID is required';
      return false;
    }
    
    if (this.order.montantTotal === undefined || this.order.montantTotal < 0) {
      this.error = 'Total amount must be a valid positive number';
      return false;
    }
    
    return true;
  }

  /**
   * Cancel form and navigate back to orders list
   */
  onCancel(): void {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.router.navigate(['/admin/orders']);
    }
  }
  
  /**
   * Format date for input field
   * @param date - The date to format
   * @returns Formatted date string for input
   */
  formatDateForInput(date: Date | undefined): string {
    if (!date) return '';
    // Format as YYYY-MM-DD for date input
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }
  
  /**
   * Handle date input changes
   * @param event - The input change event
   */
  onDateChange(event: any): void {
    if (event.target.value) {
      this.order.dateCommande = new Date(event.target.value);
    }
  }
}
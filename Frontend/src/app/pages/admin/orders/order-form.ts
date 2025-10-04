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
  templateUrl: './order-form.html',
  styleUrls: ['./order-form.css']
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

  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.error = 'Failed to load order';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      // Update existing order
      if (this.order.idCommande) {
        this.orderService.updateOrder(this.order.idCommande, this.order).subscribe({
          next: (updatedOrder) => {
            this.loading = false;
            console.log('Order updated successfully:', updatedOrder);
            this.router.navigate(['/admin/orders']);
          },
          error: (error) => {
            console.error('Error updating order:', error);
            this.error = 'Failed to update order: ' + (error.message || 'Unknown error');
            this.loading = false;
          }
        });
      }
    } else {
      // Create new order
      this.orderService.createOrder(this.order).subscribe({
        next: (newOrder) => {
          this.loading = false;
          console.log('Order created successfully:', newOrder);
          this.router.navigate(['/admin/orders']);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.error = 'Failed to create order: ' + (error.message || 'Unknown error');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/orders']);
  }
  
  // Helper method to format date for display
  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
  
  // Helper method to handle date input changes
  onDateChange(event: any): void {
    if (event.target.value) {
      this.order.dateCommande = new Date(event.target.value);
    }
  }
}
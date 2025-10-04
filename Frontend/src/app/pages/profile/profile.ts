import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, Adherent } from '../../services/user';
import { AuthService, User } from '../../services/auth';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: Adherent | null = null;
  currentUser: User | null = null;
  userOrders: Order[] = [];
  loading = false;
  error: string = '';
  ordersLoading = false;
  ordersError: string = '';

  constructor(
    private users: UserService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.migrateLegacyData();
    
    if (!this.authService.isAuthenticated()) {
      this.error = 'Authentication required. Please log in.';
      this.redirectToLogin();
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser || !this.currentUser.email) {
      this.error = 'Invalid user session. Please log in again.';
      this.redirectToLogin();
      return;
    }

    this.loadUserProfile(this.currentUser.email);
  }

  private loadUserProfile(email: string): void {
    this.loading = true;
    this.error = '';
    
    this.users.getByEmail(email).subscribe({
      next: (res1: any) => {
        const candidate = Array.isArray(res1) ? (res1[0] || null) : (res1 as Adherent | null);
        if (candidate) {
          this.user = candidate;
          this.loading = false;
          this.loadUserOrders();
          return;
        }
        this.users.getByEmailAlt(email).subscribe({
          next: (res2) => {
            this.user = res2;
            this.loading = false;
            if (!this.user) {
              this.error = 'Could not load profile data';
            } else {
              this.loadUserOrders();
            }
          },
          error: (error) => {
            this.error = 'Failed to load profile. Please try again.';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.users.getByEmailAlt(email).subscribe({
          next: (res2) => {
            this.user = res2;
            this.loading = false;
            if (!this.user) {
              this.error = 'Could not load profile data';
            } else {
              this.loadUserOrders();
            }
          },
          error: (error2) => {
            this.error = 'Failed to load profile. Please try again.';
            this.loading = false;
          }
        });
      }
    });
  }

  private loadUserOrders(): void {
    if (!this.user || !this.user.id) {
      return;
    }

    this.ordersLoading = true;
    this.ordersError = '';

    this.orderService.getOrdersByUserId(this.user.id).subscribe({
      next: (orders: Order[]) => {
        this.userOrders = orders;
        this.ordersLoading = false;
        
        if (this.user) {
          this.user.ordersCount = this.userOrders.length;
          this.user.recentOrders = this.userOrders
            .sort((a, b) => 
              new Date(b.dateCommande || 0).getTime() - new Date(a.dateCommande || 0).getTime()
            )
            .slice(0, 3)
            .map(order => ({
              id: order.idCommande,
              title: `Order #${order.idCommande}`,
              date: order.dateCommande,
              status: order.statut,
              total: order.montantTotal,
              imageUrl: 'https://via.placeholder.com/100x100/7c77c6/ffffff?text=Order'
            }));
        }
      },
      error: (error) => {
        this.ordersError = error.message || 'Failed to load order history';
        this.ordersLoading = false;
      }
    });
  }

  private redirectToLogin(): void {
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/profile', message: 'Please log in to access your profile' }
      });
    }, 2000);
  }

  editProfile() {
  }

  refreshProfile() {
    if (this.currentUser?.email) {
      this.loadUserProfile(this.currentUser.email);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserDisplayName(): string {
    return this.user?.nom || this.currentUser?.name || this.currentUser?.email || 'User';
  }

  getUserEmail(): string {
    return this.user?.email || this.currentUser?.email || '';
  }

  getUserRole(): string {
    return this.currentUser?.role || 'USER';
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UserService, Adherent } from '../../services/user';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: Adherent | null = null;
  currentUser: User | null = null;
  loading = false;
  error: string = '';
  activeTab = 'overview';

  constructor(
    private users: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Profile component initializing...');
    // Try to migrate any legacy authentication data
    this.authService.migrateLegacyData();
    
    // Use AuthService for centralized authentication management
    if (!this.authService.isAuthenticated()) {
      this.error = 'Authentication required. Please log in.';
      console.log('Profile: User not authenticated, redirecting to login');
      this.redirectToLogin();
      return;
    }

    // Get current user from AuthService
    this.currentUser = this.authService.getCurrentUser();
    console.log('Profile: Current user from AuthService:', this.currentUser);
    
    if (!this.currentUser || !this.currentUser.email) {
      this.error = 'Invalid user session. Please log in again.';
      console.log('Profile: Invalid user session, redirecting to login');
      this.redirectToLogin();
      return;
    }

    // Load user profile data
    this.loadUserProfile(this.currentUser.email);
  }

  private loadUserProfile(email: string): void {
    this.loading = true;
    this.error = '';
    
    // Try primary method, fallback to alt
    this.users.getByEmail(email).subscribe({
      next: (res1: any) => {
        const candidate = Array.isArray(res1) ? (res1[0] || null) : (res1 as Adherent | null);
        if (candidate) {
          this.user = candidate;
          this.loading = false;
          return;
        }
        // Fallback to alternative method
        this.users.getByEmailAlt(email).subscribe({
          next: (res2) => {
            this.user = res2;
            this.loading = false;
            if (!this.user) {
              this.error = 'Could not load profile data';
            }
          },
          error: (error) => {
            console.error('Error loading profile (alt method):', error);
            this.error = 'Failed to load profile. Please try again.';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading profile (primary method):', error);
        // Try alternative method as fallback
        this.users.getByEmailAlt(email).subscribe({
          next: (res2) => {
            this.user = res2;
            this.loading = false;
            if (!this.user) {
              this.error = 'Could not load profile data';
            }
          },
          error: (error2) => {
            console.error('Error loading profile (both methods failed):', error2);
            this.error = 'Failed to load profile. Please try again.';
            this.loading = false;
          }
        });
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

  // Tab navigation methods
  switchTab(tabName: string) {
    this.activeTab = tabName;
  }

  // Dashboard action methods
  editProfile() {
    console.log('Edit profile clicked');
    // TODO: Implement edit profile functionality
  }

  viewOrders() {
    this.switchTab('orders');
  }

  viewWishlist() {
    this.switchTab('wishlist');
  }

  viewSettings() {
    this.switchTab('settings');
  }

  // Authentication helper methods
  refreshProfile() {
    if (this.currentUser?.email) {
      this.loadUserProfile(this.currentUser.email);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Getters for template
  getUserDisplayName(): string {
    return this.user?.nom || this.currentUser?.name || this.currentUser?.email || 'User';
  }

  getUserEmail(): string {
    return this.user?.email || this.currentUser?.email || '';
  }

  getUserRole(): string {
    return this.currentUser?.role || 'USER';
  }

  // Debug method for troubleshooting
  debugAuthState(): void {
    console.log('=== Profile Authentication Debug ===');
    console.log('Is Authenticated:', this.authService.isAuthenticated());
    console.log('Current User:', this.currentUser);
    console.log('User Role:', this.getUserRole());
    console.log('Token:', this.authService.getToken());
    console.log('Profile User Data:', this.user);
    console.log('=== End Debug ===');
  }
} 
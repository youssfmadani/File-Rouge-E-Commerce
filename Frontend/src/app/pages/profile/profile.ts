import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, Adherent } from '../../services/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: Adherent | null = null;
  loading = false;
  error: string = '';
  activeTab = 'overview';

  private emailKey = 'auth_email';

  constructor(private users: UserService) {}

  ngOnInit(): void {
    const email = localStorage.getItem(this.emailKey);
    if (!email) {
      this.error = 'Not logged in';
      return;
    }
    this.loading = true;
    // Try primary method, fallback to alt
    this.users.getByEmail(email).subscribe((res1: any) => {
      const candidate = Array.isArray(res1) ? (res1[0] || null) : (res1 as Adherent | null);
      if (candidate) {
        this.user = candidate;
        this.loading = false;
        return;
      }
      this.users.getByEmailAlt(email).subscribe((res2) => {
        this.user = res2;
        this.loading = false;
        if (!this.user) {
          this.error = 'Could not load profile';
        }
      });
    });
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
} 
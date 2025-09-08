import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-admin-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-admin-converter.html',
  styleUrls: ['./user-admin-converter.css']
})
export class UserAdminConverter {
  users: any[] = [];
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private userService: UserService) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.message = 'Failed to load users';
        this.messageType = 'error';
        this.isLoading = false;
      }
    });
  }

  makeAdmin(userId: number): void {
    this.isLoading = true;
    this.message = '';
    
    // Call the backend endpoint to make user admin
    this.userService.makeUserAdmin(userId).subscribe({
      next: (updatedUser) => {
        this.message = `User ${updatedUser.email} has been converted to admin successfully!`;
        this.messageType = 'success';
        this.loadUsers(); // Refresh the list
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error making user admin:', error);
        this.message = 'Failed to convert user to admin';
        this.messageType = 'error';
        this.isLoading = false;
      }
    });
  }

  isAdmin(email: string): boolean {
    return email.toLowerCase().includes('admin');
  }
}
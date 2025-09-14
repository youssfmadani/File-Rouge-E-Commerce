import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Adherent } from '../../services/user';

@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-crud.html',
  styleUrls: ['./user-crud.css']
})
export class UserCrud implements OnInit {
  users: Adherent[] = [];
  filteredUsers: Adherent[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Search and filter
  searchTerm = '';
  selectedRole = '';
  roleOptions = ['admin', 'user'];
  
  // Form states
  showDetailsModal = false;
  selectedUser: Adherent | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  // Search and filter methods
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        (user.nom && user.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.prénom && user.prénom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.prenom && user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesRole = !this.selectedRole || 
        (this.selectedRole === 'admin' && user.email && this.isAdmin(user.email)) ||
        (this.selectedRole === 'user' && user.email && !this.isAdmin(user.email));
      
      return matchesSearch && matchesRole;
    });
  }

  onSearchChange(): void {
    this.filterUsers();
  }

  onRoleChange(): void {
    this.filterUsers();
  }

  // User management
  viewUserDetails(user: Adherent): void {
    this.selectedUser = user;
    this.showDetailsModal = true;
  }

  hideDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedUser = null;
  }

  makeAdmin(user: Adherent): void {
    if (user.id) {
      this.userService.makeUserAdmin(user.id).subscribe({
        next: (updatedUser) => {
          this.successMessage = `${this.getUserName(user)} has been converted to admin successfully!`;
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error making user admin:', error);
          this.errorMessage = 'Failed to convert user to admin';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  deleteUser(user: Adherent): void {
    if (confirm(`Are you sure you want to delete user "${this.getUserName(user)}"?`)) {
      if (user.id) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.successMessage = 'User deleted successfully';
            this.loadUsers();
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.errorMessage = 'Failed to delete user';
            setTimeout(() => this.errorMessage = '', 3000);
          }
        });
      }
    }
  }

  // Utility methods
  isAdmin(email: string): boolean {
    return email.toLowerCase().includes('admin');
  }

  getUserName(user: Adherent): string {
    const firstName = user.prénom || user.prenom || '';
    const lastName = user.nom || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown User';
  }

  getUserRole(user: Adherent): string {
    return (user.email && this.isAdmin(user.email)) ? 'Admin' : 'User';
  }

  getRoleClass(user: Adherent): string {
    return (user.email && this.isAdmin(user.email)) ? 'role-admin' : 'role-user';
  }

  getJoinDate(user: Adherent): string {
    const dateValue = user.createdAt || user['dateJoined'] || user['joinDate'];
    if (!dateValue) return 'N/A';
    
    if (typeof dateValue === 'string') {
      const parsedDate = new Date(dateValue);
      return isNaN(parsedDate.getTime()) ? 'N/A' : parsedDate.toLocaleDateString();
    }
    
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString();
    }
    
    return 'N/A';
  }

  getAdminCount(): number {
    return this.users.filter(user => user.email && this.isAdmin(user.email)).length;
  }

  getRegularUserCount(): number {
    return this.users.filter(user => user.email && !this.isAdmin(user.email)).length;
  }
}
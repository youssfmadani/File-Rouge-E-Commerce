import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    
    if (this.validateForm()) {
      this.isLoading = true;
      
      this.authService.login(this.loginData.email, this.loginData.password).subscribe({
        next: (success) => {
          if (success) {
            const currentUser = this.authService.getCurrentUser();
            
            const userRole = this.authService.getUserRole();
            if (userRole === 'ADMIN') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/profile']);
            }
          } else {
            const localSuccess = this.authService.loginLocal(this.loginData.email, this.loginData.password);
            if (localSuccess) {
              setTimeout(() => {
                const currentUser = this.authService.getCurrentUser();
                
                if (!currentUser) {
                  this.authService.migrateLegacyData();
                  const migratedUser = this.authService.getCurrentUser();
                }
                
                const userRole = this.authService.getUserRole();
                if (userRole === 'ADMIN') {
                  this.router.navigate(['/admin']);
                } else {
                  this.router.navigate(['/profile']);
                }
              }, 100);
            } else {
              this.errorMessage = 'Invalid email or password. Please try again.';
            }
          }
          this.isLoading = false;
        },
        error: (error) => {
          const localSuccess = this.authService.loginLocal(this.loginData.email, this.loginData.password);
          if (localSuccess) {
            setTimeout(() => {
              const currentUser = this.authService.getCurrentUser();
              
              if (!currentUser) {
                this.authService.migrateLegacyData();
                const migratedUser = this.authService.getCurrentUser();
              }
              
              const userRole = this.authService.getUserRole();
              if (userRole === 'ADMIN') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/profile']);
              }
            }, 100);
          } else {
            this.errorMessage = 'Login failed. Please check your credentials and try again.';
          }
          this.isLoading = false;
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loginData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  onGoogleLogin(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      const mockGoogleEmail = 'user@gmail.com';
      const success = this.authService.loginLocal(mockGoogleEmail, 'google-oauth');
      
      if (success) {
        const userRole = this.authService.getUserRole();
        if (userRole === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/profile']);
        }
      } else {
        this.errorMessage = 'Google login failed. Please try again.';
      }
      this.isLoading = false;
    }, 1000);
  }

  onFacebookLogin(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      const mockFacebookEmail = 'user@facebook.com';
      const success = this.authService.loginLocal(mockFacebookEmail, 'facebook-oauth');
      
      if (success) {
        const userRole = this.authService.getUserRole();
        if (userRole === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/profile']);
        }
      } else {
        this.errorMessage = 'Facebook login failed. Please try again.';
      }
      this.isLoading = false;
    }, 1000);
  }
}

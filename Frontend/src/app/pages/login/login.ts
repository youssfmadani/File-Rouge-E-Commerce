import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  // Form data
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  // UI state
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {
    console.log('Login component initialized at:', new Date().toISOString());
  }

  // Toggle password visibility
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Form submission - Enhanced with AuthService integration and admin redirect
  onSubmit(): void {
    console.log('onSubmit method called at:', new Date().toISOString());
    this.errorMessage = ''; // Clear previous errors
    
    if (this.validateForm()) {
      this.isLoading = true;
      
      // Try backend authentication first
      this.authService.login(this.loginData.email, this.loginData.password).subscribe({
        next: (success) => {
          if (success) {
            // Store email for profile page
            localStorage.setItem('auth_email', this.loginData.email);
            localStorage.setItem('userEmail', this.loginData.email);
            
            // Check user role and redirect accordingly
            const userRole = this.authService.getUserRole();
            if (userRole === 'ADMIN') {
              console.log('Admin login successful, redirecting to admin dashboard');
              this.router.navigate(['/admin']);
            } else {
              console.log('User login successful, redirecting to profile dashboard');
              this.router.navigate(['/profile']);
            }
          } else {
            // Fallback to local authentication for development
            const localSuccess = this.authService.loginLocal(this.loginData.email, this.loginData.password);
            if (localSuccess) {
              localStorage.setItem('auth_email', this.loginData.email);
              localStorage.setItem('userEmail', this.loginData.email);
              
              // Check user role and redirect accordingly
              const userRole = this.authService.getUserRole();
              if (userRole === 'ADMIN') {
                console.log('Admin local login successful, redirecting to admin dashboard');
                this.router.navigate(['/admin']);
              } else {
                console.log('User local login successful, redirecting to profile dashboard');
                this.router.navigate(['/profile']);
              }
            } else {
              this.errorMessage = 'Invalid email or password. Please try again.';
            }
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          // Fallback to local authentication
          const localSuccess = this.authService.loginLocal(this.loginData.email, this.loginData.password);
          if (localSuccess) {
            localStorage.setItem('auth_email', this.loginData.email);
            localStorage.setItem('userEmail', this.loginData.email);
            
            // Check user role and redirect accordingly
            const userRole = this.authService.getUserRole();
            if (userRole === 'ADMIN') {
              console.log('Admin local login successful, redirecting to admin dashboard');
              this.router.navigate(['/admin']);
            } else {
              console.log('User local login successful, redirecting to profile dashboard');
              this.router.navigate(['/profile']);
            }
          } else {
            this.errorMessage = 'Login failed. Please check your credentials and try again.';
          }
          this.isLoading = false;
        }
      });
    }
  }

  // Form validation
  private validateForm(): boolean {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loginData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  // Social login methods
  onGoogleLogin(): void {
    console.log('Google login clicked');
    // TODO: Implement Google OAuth login
    // For now, simulate successful login for demo purposes
    this.isLoading = true;
    
    // Simulate Google OAuth response
    setTimeout(() => {
      const mockGoogleEmail = 'user@gmail.com';
      const success = this.authService.loginLocal(mockGoogleEmail, 'google-oauth');
      
      if (success) {
        localStorage.setItem('auth_email', mockGoogleEmail);
        localStorage.setItem('userEmail', mockGoogleEmail);
        
        // Check user role and redirect accordingly
        const userRole = this.authService.getUserRole();
        if (userRole === 'ADMIN') {
          console.log('Google admin login successful, redirecting to admin dashboard');
          this.router.navigate(['/admin']);
        } else {
          console.log('Google login successful, redirecting to profile dashboard');
          this.router.navigate(['/profile']);
        }
      } else {
        this.errorMessage = 'Google login failed. Please try again.';
      }
      this.isLoading = false;
    }, 1000);
  }

  onFacebookLogin(): void {
    console.log('Facebook login clicked');
    // TODO: Implement Facebook OAuth login
    // For now, simulate successful login for demo purposes
    this.isLoading = true;
    
    // Simulate Facebook OAuth response
    setTimeout(() => {
      const mockFacebookEmail = 'user@facebook.com';
      const success = this.authService.loginLocal(mockFacebookEmail, 'facebook-oauth');
      
      if (success) {
        localStorage.setItem('auth_email', mockFacebookEmail);
        localStorage.setItem('userEmail', mockFacebookEmail);
        
        // Check user role and redirect accordingly
        const userRole = this.authService.getUserRole();
        if (userRole === 'ADMIN') {
          console.log('Facebook admin login successful, redirecting to admin dashboard');
          this.router.navigate(['/admin']);
        } else {
          console.log('Facebook login successful, redirecting to profile dashboard');
          this.router.navigate(['/profile']);
        }
      } else {
        this.errorMessage = 'Facebook login failed. Please try again.';
      }
      this.isLoading = false;
    }, 1000);
  }
}

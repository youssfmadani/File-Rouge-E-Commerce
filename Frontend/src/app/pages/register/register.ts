import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  // Form data
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  };

  // UI state
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  // Toggle password visibility
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Password strength calculation
  getPasswordStrength(): number {
    const password = this.registerData.password;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    
    return Math.min(100, strength);
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength === 0) return '';
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Good';
    if (strength < 100) return 'Strong';
    return 'Very Strong';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength === 0) return '';
    if (strength < 25) return 'strength-very-weak';
    if (strength < 50) return 'strength-weak';
    if (strength < 75) return 'strength-good';
    if (strength < 100) return 'strength-strong';
    return 'strength-very-strong';
  }

  // Password matching validation
  passwordsMatch(): boolean {
    return this.registerData.password === this.registerData.confirmPassword;
  }

  // Form submission with backend integration
  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.validateForm()) {
      this.isLoading = true;
      
      // Create user object for backend
      const userData = {
        nom: this.registerData.lastName,
        prenom: this.registerData.firstName,
        email: this.registerData.email,
        motDePasse: this.registerData.password
      };

      // Try to create user via backend
      this.userService.createUser(userData).subscribe({
        next: (user) => {
          this.successMessage = 'Account created successfully! Redirecting to login...';
          this.isLoading = false;
          
          // Redirect to login after success
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  // Enhanced form validation
  private validateForm(): boolean {
    // Check required fields
    if (!this.registerData.firstName?.trim()) {
      this.errorMessage = 'First name is required';
      return false;
    }
    
    if (!this.registerData.lastName?.trim()) {
      this.errorMessage = 'Last name is required';
      return false;
    }
    
    if (!this.registerData.email?.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    
    // Password validation
    if (!this.registerData.password) {
      this.errorMessage = 'Password is required';
      return false;
    }
    
    if (this.registerData.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return false;
    }
    
    // Confirm password validation
    if (!this.registerData.confirmPassword) {
      this.errorMessage = 'Please confirm your password';
      return false;
    }
    
    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    
    // Terms acceptance
    if (!this.registerData.acceptTerms) {
      this.errorMessage = 'Please accept the terms and conditions';
      return false;
    }
    
    return true;
  }

  // Social registration methods
  onGoogleRegister(): void {
    console.log('Google registration clicked');
    // TODO: Implement Google OAuth registration
    this.errorMessage = 'Google registration is not implemented yet';
  }

  onFacebookRegister(): void {
    console.log('Facebook registration clicked');
    // TODO: Implement Facebook OAuth registration
    this.errorMessage = 'Facebook registration is not implemented yet';
  }
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if user is authenticated and has admin role
  if (authService.isAuthenticated() && authService.hasRole('ADMIN')) {
    return true;
  }
  
  // If authenticated but not admin, redirect to profile
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/profile']);
  }
  
  // If not authenticated, redirect to login
  return router.createUrlTree(['/login']);
};
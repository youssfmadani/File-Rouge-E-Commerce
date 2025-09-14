import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { apiUrl } from './api';
import { UserService } from './user';

export interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private roleKey = 'auth_role';
  private userKey = 'auth_user';
  private loginEndpoint = apiUrl('/api/auth/login');

  constructor(private http: HttpClient, private userService: UserService) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const isAuthenticated = !!token;
    console.log('IsAuthenticated check - Token:', token, 'Result:', isAuthenticated);
    return isAuthenticated;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('GetToken: Retrieved token:', token);
    return token;
  }

  getUserRole(): string | null {
    const role = localStorage.getItem(this.roleKey);
    console.log('GetUserRole: Retrieved role:', role);
    return role;
  }

  hasRole(requiredRole: string): boolean {
    const role = this.getUserRole();
    return !!role && role.toUpperCase() === requiredRole.toUpperCase();
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    console.log('GetCurrentUser: Raw user JSON from localStorage:', userJson);
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        console.log('GetCurrentUser: Parsed user object:', user);
        return user;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    console.log('GetCurrentUser: No user data found in localStorage');
    return null;
  }

  setCurrentUser(user: User): void {
    console.log('SetCurrentUser: Storing user:', user);
    try {
      const userJson = JSON.stringify(user);
      console.log('SetCurrentUser: User JSON to store:', userJson);
      localStorage.setItem(this.userKey, userJson);
      console.log('SetCurrentUser: User stored successfully');
    } catch (error) {
      console.error('SetCurrentUser: Error serializing user:', error);
    }
  }

  // Local fallback login (kept for now)
  loginLocal(email: string, password: string): boolean {
    if (!email || !password) return false;
    const isAdmin = email.toLowerCase().includes('admin');
    const role = isAdmin ? 'ADMIN' : 'USER';
    const fakeToken = 'dummy-token';
    
    console.log('LoginLocal: Starting authentication for:', email);
    
    // Store authentication data
    localStorage.setItem(this.tokenKey, fakeToken);
    localStorage.setItem(this.roleKey, role);
    // Store email for legacy compatibility
    localStorage.setItem('auth_email', email);
    
    // Check if user exists in database, create if not
    this.getOrCreateUser(email, role).subscribe({
      next: (user) => {
        console.log('LoginLocal: User created/retrieved:', user);
        this.setCurrentUser(user);
      },
      error: (error) => {
        console.error('LoginLocal: Error creating/retrieving user:', error);
        // Create a temporary user as fallback
        const names = email.split('@')[0].split('.');
        const firstName = names[0] || 'User';
        const user: User = {
          id: Math.floor(Math.random() * 10000) + 1000,
          email: email,
          role: role,
          name: firstName
        };
        this.setCurrentUser(user);
      }
    });
    
    // Verify storage worked
    const storedUser = this.getCurrentUser();
    const storedToken = this.getToken();
    const storedRole = this.getUserRole();
    
    console.log('LoginLocal: Authentication data stored:');
    console.log('  - Token:', storedToken);
    console.log('  - Role:', storedRole);
    console.log('  - User:', storedUser);
    console.log('  - Is Authenticated:', this.isAuthenticated());
    
    console.log('LoginLocal: Authentication completed successfully');
    return true;
  }

  // Backend login (expects {token, role, user} response)
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string; role: string; user?: User }>(this.loginEndpoint, { email, password }).pipe(
      switchMap(res => {
        console.log('Backend login response:', res);
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          if (res.role) {
            localStorage.setItem(this.roleKey, res.role);
          }
          
          // Handle user object from backend
          if (res.user) {
            console.log('Backend login: Using user from response:', res.user);
            this.setCurrentUser(res.user);
          } else {
            // Check if user exists in database, create if not
            return this.getOrCreateUser(email, res.role || 'USER').pipe(
              tap(user => {
                this.setCurrentUser(user);
              }),
              map(() => res)
            );
          }
          
          // If we already handled the user, just return the response
          return of(res);
        }
        return of(res);
      }),
      map(res => !!res?.token),
      catchError((error) => {
        console.error('Backend login error:', error);
        return of(false);
      })
    );
  }
  
  // Get existing user or create new one
  private getOrCreateUser(email: string, role: string): Observable<User> {
    // First, try to get the user by email
    return this.userService.getByEmail(email).pipe(
      switchMap(existingUser => {
        if (existingUser && existingUser.id) {
          // User exists, return it
          const user: User = {
            id: existingUser.id,
            email: existingUser.email || email,
            role: role,
            name: existingUser.prenom || existingUser.prénom || email.split('@')[0]
          };
          console.log('Using existing user:', user);
          return of(user);
        } else {
          // User doesn't exist, create a new one
          const names = email.split('@')[0].split('.');
          const firstName = names[0] || 'User';
          const lastName = names.length > 1 ? names.slice(1).join(' ') : 'Customer';
          
          const newUser = {
            nom: lastName,
            prenom: firstName,
            email: email,
            motDePasse: 'defaultPassword123' // In a real app, this would be properly handled
          };
          
          console.log('Creating new user:', newUser);
          return this.userService.createUser(newUser).pipe(
            map(createdUser => {
              const user: User = {
                id: createdUser.id!,
                email: createdUser.email || email,
                role: role,
                name: createdUser.prenom || createdUser.prénom || firstName
              };
              console.log('Created user:', user);
              return user;
            }),
            catchError(error => {
              console.error('Error creating user:', error);
              throw error; // Re-throw the error instead of creating a temporary user
            })
          );
        }
      }),
      catchError(error => {
        console.error('Error getting/creating user:', error);
        throw error; // Re-throw the error instead of creating a temporary user
      })
    );
  }

  logout(): void {
    console.log('Logout: Clearing all authentication data');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('auth_email');
    localStorage.removeItem('userEmail');
    
    console.log('Logout: Authentication data cleared');
    console.log('  - auth_token exists:', !!localStorage.getItem(this.tokenKey));
    console.log('  - auth_role exists:', !!localStorage.getItem(this.roleKey));
    console.log('  - auth_user exists:', !!localStorage.getItem(this.userKey));
    console.log('  - auth_email exists:', !!localStorage.getItem('auth_email'));
    console.log('  - userEmail exists:', !!localStorage.getItem('userEmail'));
  }

  // Clean up any legacy user data
  cleanupLegacyData(): void {
    const keysToRemove = ['auth_user', 'auth_email', 'userEmail'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Migrate legacy email data to current user if needed
  migrateLegacyData(): void {
    console.log('MigrateLegacyData: Starting migration check...');
    const currentUser = this.getCurrentUser();
    console.log('MigrateLegacyData: Current user before migration:', currentUser);
    
    if (!currentUser && this.isAuthenticated()) {
      console.log('MigrateLegacyData: User authenticated but no user object found, attempting migration...');
      // Try to recover from legacy email data
      const legacyEmail = localStorage.getItem('auth_email') || localStorage.getItem('userEmail');
      console.log('MigrateLegacyData: Found legacy email:', legacyEmail);
      
      if (legacyEmail) {
        console.log('Migrating legacy authentication data for:', legacyEmail);
        const isAdmin = legacyEmail.toLowerCase().includes('admin');
        const role = this.getUserRole() || (isAdmin ? 'ADMIN' : 'USER');
        const user: User = {
          id: isAdmin ? 1 : Math.floor(Math.random() * 1000) + 100,
          email: legacyEmail,
          role: role,
          name: legacyEmail.split('@')[0]
        };
        
        console.log('MigrateLegacyData: Creating user object:', user);
        this.setCurrentUser(user);
        
        // Verify migration worked
        const migratedUser = this.getCurrentUser();
        console.log('MigrateLegacyData: User after migration:', migratedUser);
        
        if (migratedUser) {
          console.log('Legacy data migration completed successfully:', migratedUser);
        } else {
          console.error('MigrateLegacyData: Migration failed - user still null');
        }
      } else {
        console.log('MigrateLegacyData: No legacy email found, cannot migrate');
      }
    } else if (currentUser) {
      console.log('MigrateLegacyData: User already exists, no migration needed:', currentUser);
    } else {
      console.log('MigrateLegacyData: Not authenticated, no migration needed');
    }
  }
}



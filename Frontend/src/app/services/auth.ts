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
    return isAuthenticated;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token;
  }

  getUserRole(): string | null {
    const role = localStorage.getItem(this.roleKey);
    return role;
  }

  hasRole(requiredRole: string): boolean {
    const role = this.getUserRole();
    return !!role && role.toUpperCase() === requiredRole.toUpperCase();
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        return user;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  setCurrentUser(user: User): void {
    try {
      const userJson = JSON.stringify(user);
      localStorage.setItem(this.userKey, userJson);
    } catch (error) {
    }
  }

  loginLocal(email: string, password: string): boolean {
    if (!email || !password) return false;
    const isAdmin = email.toLowerCase().includes('admin');
    const role = isAdmin ? 'ADMIN' : 'USER';
    const fakeToken = 'dummy-token';
    
    localStorage.setItem(this.tokenKey, fakeToken);
    localStorage.setItem(this.roleKey, role);
    localStorage.setItem('auth_email', email);
    
    this.getOrCreateUser(email, role).subscribe({
      next: (user) => {
        this.setCurrentUser(user);
      },
      error: (error) => {
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
    
    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string; role: string; user?: User }>(this.loginEndpoint, { email, password }).pipe(
      switchMap(res => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          if (res.role) {
            localStorage.setItem(this.roleKey, res.role);
          }
          
          if (res.user) {
            this.setCurrentUser(res.user);
          } else {
            return this.getOrCreateUser(email, res.role || 'USER').pipe(
              tap(user => {
                this.setCurrentUser(user);
              }),
              map(() => res)
            );
          }
          
          return of(res);
        }
        return of(res);
      }),
      map(res => !!res?.token),
      catchError((error) => {
        return of(false);
      })
    );
  }
  
  public getOrCreateUser(email: string, role: string): Observable<User> {
    return this.userService.getByEmail(email).pipe(
      switchMap(existingUser => {
        if (existingUser && existingUser.id) {
          const user: User = {
            id: existingUser.id,
            email: existingUser.email || email,
            role: role,
            name: existingUser.prenom || existingUser.prénom || email.split('@')[0]
          };
          return of(user);
        } else {
          const names = email.split('@')[0].split('.');
          const firstName = names[0] || 'User';
          const lastName = names.length > 1 ? names.slice(1).join(' ') : 'Customer';
          
          const newUser = {
            nom: lastName,
            prenom: firstName,
            email: email,
            motDePasse: 'defaultPassword123'
          };
          
          return this.userService.createUser(newUser).pipe(
            map(createdUser => {
              const user: User = {
                id: createdUser.id!,
                email: createdUser.email || email,
                role: role,
                name: createdUser.prenom || createdUser.prénom || firstName
              };
              return user;
            }),
            catchError(error => {
              throw error;
            })
          );
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('auth_email');
    localStorage.removeItem('userEmail');
  }

  cleanupLegacyData(): void {
    const keysToRemove = ['auth_user', 'auth_email', 'userEmail'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  migrateLegacyData(): void {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser && this.isAuthenticated()) {
      const legacyEmail = localStorage.getItem('auth_email') || localStorage.getItem('userEmail');
      
      if (legacyEmail) {
        const isAdmin = legacyEmail.toLowerCase().includes('admin');
        const role = this.getUserRole() || (isAdmin ? 'ADMIN' : 'USER');
        
        this.getOrCreateUser(legacyEmail, role).subscribe({
          next: (user) => {
            this.setCurrentUser(user);
          },
          error: (error) => {
            const user: User = {
              id: isAdmin ? 1 : Math.floor(Math.random() * 1000) + 100,
              email: legacyEmail,
              role: role,
              name: legacyEmail.split('@')[0]
            };
            this.setCurrentUser(user);
          }
        });
      }
    }
  }
}



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { apiUrl } from './api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private roleKey = 'auth_role';
  private loginEndpoint = apiUrl('/api/auth/login');

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  hasRole(requiredRole: string): boolean {
    const role = this.getUserRole();
    return !!role && role.toUpperCase() === requiredRole.toUpperCase();
  }

  // Local fallback login (kept for now)
  loginLocal(email: string, password: string): boolean {
    if (!email || !password) return false;
    const isAdmin = email.toLowerCase().includes('admin');
    const role = isAdmin ? 'ADMIN' : 'USER';
    const fakeToken = 'dummy-token';
    localStorage.setItem(this.tokenKey, fakeToken);
    localStorage.setItem(this.roleKey, role);
    return true;
  }

  // Backend login (expects {token, role} response)
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string; role: string }>(this.loginEndpoint, { email, password }).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          if (res.role) {
            localStorage.setItem(this.roleKey, res.role);
          }
        }
      }),
      map(res => !!res?.token),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }
}



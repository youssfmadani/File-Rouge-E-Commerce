import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { apiUrl } from './api';

export interface Adherent {
  id?: number;
  nom?: string;
  prénom?: string;
  prenom?: string;
  email?: string;
  motDePasse?: string;
  createdAt?: string;
  ordersCount?: number;
  wishlistCount?: number;
  rating?: number;
  recentOrders?: any[];
  wishlist?: any[];
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private adherentsUrl = apiUrl('/api/adherents');

  constructor(private http: HttpClient) {}

  getByEmail(email: string): Observable<Adherent | null> {
    return this.getByEmailAlt(email).pipe(
      switchMap(result => {
        if (result) {
          return of(result);
        }
        const params = new HttpParams().set('email', email);
        return this.http.get<Adherent[]>(this.adherentsUrl, { params }).pipe(
          map(adherents => adherents && adherents.length > 0 ? this.mapBackendAdherent(adherents[0]) : null),
          catchError(() => of(null))
        );
      }),
      catchError(() => of(null))
    );
  }

  getByEmailAlt(email: string): Observable<Adherent | null> {
    return this.http.get<Adherent>(apiUrl(`/api/adherents/email/${encodeURIComponent(email)}`)).pipe(
      map(adherent => this.mapBackendAdherent(adherent)),
      catchError(() => of(null))
    );
  }

  getById(id: number): Observable<Adherent | null> {
    return this.http.get<Adherent>(`${this.adherentsUrl}/${id}`).pipe(
      map(adherent => this.mapBackendAdherent(adherent)),
      catchError(error => {
        return of(null);
      })
    );
  }

  getAllUsers(): Observable<Adherent[]> {
    return this.http.get<Adherent[]>(this.adherentsUrl).pipe(
      map(adherents => adherents.map(a => this.mapBackendAdherent(a))),
      catchError(error => {
        return of([]);
      })
    );
  }

  createUser(adherent: Adherent): Observable<Adherent> {
    const mappedAdherent = this.mapFrontendAdherent(adherent);
    return this.http.post<Adherent>(this.adherentsUrl, mappedAdherent).pipe(
      map(a => this.mapBackendAdherent(a)),
      catchError(error => {
        throw error;
      })
    );
  }

  updateUser(id: number, adherent: Adherent): Observable<Adherent> {
    return this.http.put<Adherent>(`${this.adherentsUrl}/${id}`, this.mapFrontendAdherent(adherent)).pipe(
      map(a => this.mapBackendAdherent(a)),
      catchError(error => {
        throw error;
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adherentsUrl}/${id}`).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  makeUserAdmin(id: number): Observable<Adherent> {
    return this.http.post<Adherent>(`${this.adherentsUrl}/${id}/make-admin`, {}).pipe(
      map(a => this.mapBackendAdherent(a)),
      catchError(error => {
        throw error;
      })
    );
  }

  private mapBackendAdherent(adherent: any): Adherent {
    if (!adherent) return adherent;
    
    return {
      ...adherent,
      prenom: adherent.prénom || adherent.prenom,
      ordersCount: adherent.ordersCount || 0,
      wishlistCount: adherent.wishlistCount || 0,
      rating: adherent.rating || 4.5,
      recentOrders: adherent.recentOrders || [],
      wishlist: adherent.wishlist || []
    };
  }

  private mapFrontendAdherent(adherent: Adherent): any {
    const result = { ...adherent };
    if (result.prenom && !result.prénom) {
      result.prénom = result.prenom;
      delete result.prenom;
    }
    return result;
  }


}

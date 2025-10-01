import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiUrl } from './api';

export interface Adherent {
  id?: number;
  nom?: string;
  prénom?: string;
  email?: string;
  motDePasse?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdherentService {
  private adherentsUrl = apiUrl('/api/adherents');

  constructor(private http: HttpClient) {}

  getAllAdherents(): Observable<Adherent[]> {
    return this.http.get<Adherent[]>(this.adherentsUrl).pipe(
      catchError(error => {
        console.error('Error fetching adherents:', error);
        return throwError(error);
      })
    );
  }

  getAdherentById(id: number): Observable<Adherent> {
    return this.http.get<Adherent>(`${this.adherentsUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching adherent:', error);
        return throwError(error);
      })
    );
  }

  createAdherent(adherent: Adherent): Observable<Adherent> {
    return this.http.post<Adherent>(this.adherentsUrl, adherent).pipe(
      catchError(error => {
        console.error('Error creating adherent:', error);
        return throwError(error);
      })
    );
  }

  updateAdherent(id: number, adherent: Adherent): Observable<Adherent> {
    return this.http.put<Adherent>(`${this.adherentsUrl}/${id}`, adherent).pipe(
      catchError(error => {
        console.error('Error updating adherent:', error);
        return throwError(error);
      })
    );
  }

  deleteAdherent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adherentsUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting adherent:', error);
        return throwError(error);
      })
    );
  }

  makeAdmin(id: number): Observable<Adherent> {
    return this.http.post<Adherent>(`${this.adherentsUrl}/${id}/make-admin`, {}).pipe(
      catchError(error => {
        console.error('Error making adherent admin:', error);
        return throwError(error);
      })
    );
  }
}
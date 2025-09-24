import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UpdateRoleRequest, UserInfos } from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly API_URL = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // Récupérer tout les users
  getAllUsers(): Observable<UserInfos[]> {
    return this.http.get<UserInfos[]>(`${this.API_URL}`).pipe(catchError(this.handleError));
  }

  // Supprimer un user
  deleteUser(userId: string): Observable<UserInfos> {
    return this.http
      .delete<UserInfos>(`${this.API_URL}/${userId}`)
      .pipe(catchError(this.handleError));
  }

  // update user
  updateRoleUser(userId: string, userData: UpdateRoleRequest): Observable<UserInfos> {
    return this.http
      .put<UserInfos>(`${this.API_URL}/${userId}`, userData)
      .pipe(catchError(this.handleError));
  }

  // Récupérer un user par id
  getUserById(userId: string): Observable<UserInfos> {
    return this.http.get<UserInfos>(`${this.API_URL}/${userId}`).pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 401:
          errorMessage = 'Non autorisé - Vérifiez vos permissions';
          break;
        case 403:
          errorMessage = 'Accès interdit - Permissions insuffisantes';
          break;
        case 404:
          errorMessage = 'Utilisateur non trouvé';
          break;
        case 409:
          errorMessage = 'Conflit - Email déjà utilisé';
          break;
        case 400:
          errorMessage = error.error?.message || 'Données invalides';
          break;
        case 500:
          errorMessage = 'Erreur serveur interne';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.error?.message || error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}

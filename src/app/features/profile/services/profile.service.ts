// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { updateUserRequest, updateUserResponse } from '../models/profile.model';
import { API_Backend } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly API_URL = `${API_Backend.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * updateUser
   * ----------
   * Met à jour les informations d’un utilisateur existant via l’API.
   *
   * Paramètres :
   * - userId   : identifiant unique de l’utilisateur à modifier
   * - userData : objet contenant les nouvelles données de l’utilisateur
   *
   * Processus :
   * 1. Envoie une requête HTTP PUT vers l’endpoint `${API_URL}/{userId}`
   * 2. Transmet l’objet `userData` dans le corps de la requête
   * 3. Retourne la réponse typée en `updateUserResponse`
   * 4. Gestion des erreurs centralisée via `handleError`
   *
   * Résultat :
   * - Observable<updateUserResponse>
   *   -> contient les informations mises à jour de l’utilisateur
   */
  updateUser(userId: string, userData: updateUserRequest): Observable<updateUserResponse> {
    return this.http
      .put<updateUserResponse>(`${this.API_URL}/${userId}`, userData)
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 401) {
        errorMessage = 'Identifiants invalides';
      } else if (error.status === 409) {
        errorMessage = 'Email déjà utilisé';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Données invalides';
      } else {
        errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}

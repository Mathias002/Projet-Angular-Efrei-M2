import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UpdateRoleRequest, UserInfos } from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly API_URL = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  /**
   * getAllUsers
   * -----------
   * Récupère la liste complète des utilisateurs depuis l’API.
   *
   * Retour :
   * - Observable émettant un tableau de `UserInfos`
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  getAllUsers(): Observable<UserInfos[]> {
    return this.http.get<UserInfos[]>(`${this.API_URL}`).pipe(catchError(this.handleError));
  }

  /**
   * deleteUser
   * ----------
   * Supprime un utilisateur via son identifiant unique.
   *
   * Paramètres :
   * - userId : string -> identifiant unique de l’utilisateur à supprimer
   *
   * Retour :
   * - Observable émettant l’objet `UserInfos` de l’utilisateur supprimé
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  deleteUser(userId: string): Observable<UserInfos> {
    return this.http
      .delete<UserInfos>(`${this.API_URL}/${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * updateRoleUser
   * ----------
   * Met à jour le rôle d'un utilisateur via son identifiant unique.
   *
   * Paramètres :
   * - userId : string -> identifiant unique de l’utilisateur à mettre à jour
   * - userData : interface -> données de mise à jour du rôle
   *
   * Retour :
   * - Observable émettant l’objet `UserInfos` de l’utilisateur mis à jour
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  updateRoleUser(userId: string, updateRoleRequest: UpdateRoleRequest): Observable<UserInfos> {
    return this.http
      .put<UserInfos>(`${this.API_URL}/${userId}`, updateRoleRequest)
      .pipe(catchError(this.handleError));
  }

  /**
   * getUserById
   * ----------
   * Récupère un utilisateur via son identifiant unique.
   *
   * Paramètres :
   * - userId : string -> identifiant unique de l’utilisateur à récupérer
   *
   * Retour :
   * - Observable émettant l’objet `UserInfos` de l’utilisateur
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
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

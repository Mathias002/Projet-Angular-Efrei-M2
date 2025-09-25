// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Collection,
  CreateCollectionRequest,
  MangaCollection,
  UpdateCollectionRequest,
  UpdateMangaCollection,
} from '../models/collection.model';
import { API_Backend } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly API_URL = `${API_Backend.apiUrl}/collections`;

  constructor(private http: HttpClient) {}

  /**
   * createCollection
   * ----------
   * Créer une collection
   *
   * Paramètres :
   * - collectionData : Interface  `CreateCollectionRequest` -> données de la collection à créer
   *
   * Retour :
   * - Observable émettant l’objet `Collection` de la collection ajouté
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  createCollection(collectionData: CreateCollectionRequest): Observable<Collection> {
    return this.http
      .post<Collection>(`${this.API_URL}`, collectionData)
      .pipe(catchError(this.handleError));
  }

  /**
   * deleteCollection
   * ----------
   * Supprime une collection via son identifiant unique.
   *
   * Paramètres :
   * - collectionId : string -> identifiant unique de la collection à supprimer
   *
   * Retour :
   * - Observable émettant l’objet `Collection` de la collection supprimée
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  deleteCollection(collectionId: string): Observable<Collection> {
    return this.http
      .delete<Collection>(`${this.API_URL}/${collectionId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * updateCollection
   * ----------
   * Met à jour une collection via son identifiant unique.
   *
   * Paramètres :
   * - collectionId : string -> identifiant unique de la collection à mettre à jour
   * - collectionData : interface -> données de mise à jour de la collection
   *
   * Retour :
   * - Observable émettant l’objet `Collection` de la collection mis à jour
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  updateCollection(
    collectionId: string,
    collectionData: UpdateCollectionRequest,
  ): Observable<Collection> {
    return this.http
      .put<Collection>(`${this.API_URL}/${collectionId}`, collectionData)
      .pipe(catchError(this.handleError));
  }

  /**
   * getCollectionsByUser
   * ----------
   * Récupère les collections d'un utilisateur via son identifiant unique.
   *
   * Paramètres :
   * - userId : string -> identifiant unique de l'utilisateur
   *
   * Retour :
   * - Observable émettant un tableau de l’objet `Collection`
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  getCollectionsByUser(userId: string): Observable<Collection[]> {
    return this.http
      .get<Collection[]>(`${this.API_URL}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * getCollectionById
   * ----------
   * Récupère une collection via son identifiant unique.
   *
   * Paramètres :
   * - collectionId : string -> identifiant unique de la collection à récupérer
   *
   * Retour :
   * - Observable émettant l’objet `Collection` de la collection récupérée
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  getCollectionById(collectionId: string): Observable<Collection> {
    return this.http
      .get<Collection>(`${this.API_URL}/${collectionId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * addMangaToCollection
   * ----------
   * Met à jour le rôle d'un utilisateur via son identifiant unique.
   *
   * Paramètres :
   * - collectionId : string -> identifiant unique de la collection où ajouter le manga
   * - addMangaCollection : interface -> données d'ajout du manga'
   *
   * Retour :
   * - Observable émettant l’objet `Collection` de la collection
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  addMangaToCollection(
    collectionId: string,
    addMangaCollection: MangaCollection,
  ): Observable<Collection> {
    return this.http
      .post<Collection>(`${this.API_URL}/${collectionId}/add-manga`, addMangaCollection)
      .pipe(catchError(this.handleError));
  }

  /**
   * deleteMangaOfCollection
   * ----------
   * Supprime un manga d'une collection via son identifiant unique ainsi que celui de la collection.
   *
   * Paramètres :
   * - collectionId : string -> identifiant unique de la collection
   * - mangaId : string -> identifiant unique du manga à supprimer
   *
   * Retour :
   * - Observable émettant l’objet `Collection`
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  deleteMangaOfCollection(collectionId: string, mangaId: string): Observable<Collection> {
    return this.http
      .delete<Collection>(`${this.API_URL}/${collectionId}/delete-manga/${mangaId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * updateMangaOfCollection
   * ----------
   * Met à jour un manga d'une collection via son identifiant unique ainsi que celui de la collection.
   *
   * Paramètres :
   * - mangaId : string -> identifiant unique du manga à supprimer
   * - collectionId : string -> identifiant unique de la collection
   * - updateMangaCollection : interface -> données de mise à jour du manga
   *
   * Retour :
   * - Observable émettant l’objet `Collection` de la collection mis à jour
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  updateMangaOfCollection(
    collectionId: string,
    mangaId: string,
    updateMangaCollection: UpdateMangaCollection,
  ): Observable<Collection> {
    return this.http
      .put<Collection>(
        `${this.API_URL}/${collectionId}/update-manga/${mangaId}`,
        updateMangaCollection,
      )
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
      switch (error.status) {
        case 401:
          errorMessage = 'Non autorisé - Vérifiez vos permissions';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 404:
          errorMessage = 'Collection non trouvée';
          break;
        case 409:
          errorMessage = 'Une collection avec ce nom existe déjà';
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

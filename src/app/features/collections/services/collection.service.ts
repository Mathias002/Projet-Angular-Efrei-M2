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

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly API_URL = 'http://localhost:3000/collections';

  constructor(private http: HttpClient) {}

  // Créer une collection
  createCollection(collectionData: CreateCollectionRequest): Observable<Collection> {
    return this.http
      .post<Collection>(`${this.API_URL}`, collectionData)
      .pipe(catchError(this.handleError));
  }

  // Supprimer une collection
  deleteCollection(collectionId: string): Observable<Collection> {
    return this.http
      .delete<Collection>(`${this.API_URL}/${collectionId}`)
      .pipe(catchError(this.handleError));
  }

  updateCollection(
    collectionId: string,
    collectionData: UpdateCollectionRequest,
  ): Observable<Collection> {
    return this.http
      .put<Collection>(`${this.API_URL}/${collectionId}`, collectionData)
      .pipe(catchError(this.handleError));
  }

  getCollectionsByUser(userId: string): Observable<Collection[]> {
    return this.http
      .get<Collection[]>(`${this.API_URL}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  getCollectionById(collectionId: string): Observable<Collection> {
    return this.http
      .get<Collection>(`${this.API_URL}/${collectionId}`)
      .pipe(catchError(this.handleError));
  }

  // Ajouter un manga dans une collection
  addMangaToCollection(
    collectionId: string,
    addMangaCollection: MangaCollection,
  ): Observable<Collection> {
    return this.http
      .post<Collection>(`${this.API_URL}/${collectionId}/add-manga`, addMangaCollection)
      .pipe(catchError(this.handleError));
  }

  // Supprimer un manga dans une collection
  deleteMangaOfCollection(collectionId: string, mangaId: string): Observable<Collection> {
    return this.http
      .delete<Collection>(`${this.API_URL}/${collectionId}/delete-manga/${mangaId}`)
      .pipe(catchError(this.handleError));
  }

  // Mettre à jour un manga dans une collection
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

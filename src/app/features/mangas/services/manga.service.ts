import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MangaInfos, MangaListResponse } from '../models/manga.model';
import { API_Manga } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  private readonly API_URL = `${API_Manga.apiUrl}`;

  constructor(private http: HttpClient) {}

  data$!: Observable<{ data: MangaInfos }>;

  /**
   * getMangaSearch
   * ---------------
   * Récupère une liste de mangas depuis l’API avec pagination.
   *
   * Paramètres (tous optionnels) :
   * - page           : numéro de la page à récupérer
   * - limit          : nombre d’éléments par page
   *
   * Processus :
   * 1. Initialise un objet `HttpParams`
   * 2. Ajoute uniquement les paramètres définis (ignore les undefined)
   * 3. Envoie une requête HTTP GET vers l’endpoint `${API_URL}`
   * 4. Retourne un Observable<MangaListResponse>
   * 5. Gestion des erreurs via `handleError`
   *
   * Résultat :
   * - Observable<MangaListResponse>
   *   -> contient la pagination et la liste des mangas
   */
  getMangaSearch(page?: string, limit?: string): Observable<MangaListResponse> {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.set('page', page);
    }
    if (limit !== undefined) {
      params = params.set('limit', limit);
    }

    return this.http
      .get<MangaListResponse>(`${this.API_URL}`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * getMangaById
   * ----------
   * Récupère un manga via son identifiant unique.
   *
   * Paramètres :
   * - mangaId : number -> identifiant unique du manga
   *
   * Retour :
   * - Observable émettant l’objet `MangaInfos`
   * - En cas d’erreur HTTP, la méthode `handleError` est appelée
   */
  getMangaById(mangaId: number): Observable<{ data: MangaInfos }> {
    return this.http
      .get<{ data: MangaInfos }>(`${this.API_URL}/${mangaId}`)
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur coté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur coté serveur
      switch (error.status) {
        case 404:
          errorMessage = 'Mangas non trouvés';
          break;
        case 400:
          errorMessage = error.error?.message || 'Données de recherche invalides';
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

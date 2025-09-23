import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MangaInfos, MangaListResponse } from '../models/manga.model';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  private readonly API_URL = 'https://api.jikan.moe/v4/manga';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  data$!: Observable<{ data: MangaInfos }>;

  // Récupérer tout les users
  getMangaSearch(
    page?: string,
    limit?: string,
    q?: string,
    type?: string, //Enum: "manga" "novel" "lightnovel" "oneshot" "doujin" "manhwa" "manhua" Available Manga types
    score?: number,
    min_score?: number, // Set a minimum score for results.
    max_score?: number, // Set a maximum score for results
    status?: string, // Enum: "publishing" "complete" "hiatus" "discontinued" "upcoming" Available Manga statuses
    sfw?: boolean, // Filter out Adult entries
    genres?: string, // Filter by genre(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
    genres_exclude?: string, // Exclude genre(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
    order_by?: string, // Enum: "mal_id" "title" "start_date" "end_date" "chapters" "volumes" "score" "scored_by" "rank" "popularity" "members" "favorites" Available Manga order_by properties
    sort?: string, // Enum: "desc" "asc" Search query sort direction
    letter?: string, // Return entries starting with the given letter
    magazines?: string, // Filter by magazine(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
    start_date?: string, // Filter by starting date. Format: YYYY-MM-DD. e.g 2022, 2005-05, 2005-01-01
    end_date?: string, // Filter by ending date. Format: YYYY-MM-DD. e.g 2022, 2005-05, 2005-01-01
  ): Observable<MangaListResponse> {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.set('page', page);
    }
    if (limit !== undefined) {
      params = params.set('limit', limit);
    }
    if (q !== undefined) {
      params = params.set('q', q);
    }
    if (type !== undefined) {
      params = params.set('type', type);
    }
    if (score !== undefined) {
      params = params.set('score', score);
    }
    if (min_score !== undefined) {
      params = params.set('min_score', min_score);
    }
    if (max_score !== undefined) {
      params = params.set('max_score', max_score);
    }
    if (status !== undefined) {
      params = params.set('status', status);
    }
    if (sfw !== undefined) {
      params = params.set('sfw', sfw);
    }
    if (genres !== undefined) {
      params = params.set('genres', genres);
    }
    if (genres_exclude !== undefined) {
      params = params.set('genres_exclude', genres_exclude);
    }
    if (order_by !== undefined) {
      params = params.set('order_by', order_by);
    }
    if (sort !== undefined) {
      params = params.set('sort', sort);
    }
    if (letter !== undefined) {
      params = params.set('letter', letter);
    }
    if (magazines !== undefined) {
      params = params.set('magazines', magazines);
    }
    if (start_date !== undefined) {
      params = params.set('start_date', start_date);
    }
    if (end_date !== undefined) {
      params = params.set('end_date', end_date);
    }

    return this.http
      .get<MangaListResponse>(`${this.API_URL}?`, { params })
      .pipe(catchError(this.handleError));
  }

  // Récupérer un manga par id
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

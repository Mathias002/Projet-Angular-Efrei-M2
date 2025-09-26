import { Component, OnInit, Renderer2, signal } from '@angular/core';
import { MangaService } from '../../services/manga.service';
import { MangaInfos, MangaListResponse } from '../../models/manga.model';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BackToTopComponent } from '../../../../shared/components/back-to-top/back-to-top.component';
import { MangaDetailsModalComponent } from '../mangasDetails/manga-details-modal.component';
import { AddMangaToCollectionModalComponent } from '../addMangas/add-manga-to-collection-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingDirective } from '../../../../shared/directives/appLoading/appLoading.directive';
import { ErrorNetworkDirective } from '../../../../shared/directives/appErrorNetwork/appErrorNetwork.directive';

@Component({
  selector: 'app-manga-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    BackToTopComponent,
    MangaDetailsModalComponent,
    AddMangaToCollectionModalComponent,
    LoadingDirective,
    ErrorNetworkDirective,
  ],
  templateUrl: './manga.component.html',
})
export class MangaListComponent implements OnInit {
  //#region Signals
  // Signal Manga
  mangaList = signal<MangaListResponse | null>(null);
  selectedManga = signal<MangaInfos | null>(null);
  selectedMangaForCollection = signal<MangaInfos | null>(null);
  mangaCount = signal<number | null>(null);
  floorMangaCount = signal<number>(0);

  // Affichage des Modals
  showAddToCollectionModal = signal<boolean>(false);
  showDetailsMangaModal = signal<boolean>(false);

  // Signal Actions
  imageLoading = signal<boolean>(true);
  pageLoading = signal<boolean>(true);

  // Signal Current Page
  currentPage = signal<number>(1);
  sizePage = signal<number>(25);

  // Signal API
  isAPIJoignable = signal<boolean>(false);

  // Signal message d'erreur
  errorMessage = signal<string>('');
  //#endregion

  constructor(
    private mangaService: MangaService,
    private renderer: Renderer2,
  ) {}

  // Simule un latence serveur et affiche le template de loading, ensuite récupère tout les mangas et met à jour le signal `imageLoading` à false
  ngOnInit() {
    setTimeout(() => {
      this.pageLoading.set(false);
    }, 1000);
    this.getAllMangas();
    this.imageLoading.set(false);
  }

  //#region Mangas
  /**
   * getAllMangas
   * ------------
   * Récupère l’ensemble des mangas depuis l’API et met à jour l’état local.
   *
   * Étapes :
   * 1. Appelle le service `mangaService.getMangaSearch()` pour interroger l’API
   * 2. Gestion du flux `subscribe` :
   *    - next :
   *      -> Met à jour `isAPIJoignable` à `true` (API accessible)
   *      -> Met à jour `mangaList` avec les données reçues
   *      -> Calcule et stocke :
   *          - `mangaCount` : nombre total de mangas
   *          - `floorMangaCount` : arrondi à l’inférieur par tranche de 1000
   *      -> Met `pageLoading` à `false` (chargement terminé)
   *    - error :
   *      -> Log l’erreur complète en console
   *      -> Met `pageLoading` à `false`
   *      -> Vérifie le type et le code de l’erreur pour déterminer si l’API est joignable :
   *          * Erreur réseau (`isNetworkError`) → API non joignable
   *          * Erreur `status === 0` → problème CORS ou serveur inaccessible
   *          * Erreurs `>= 500` → problème serveur
   *          * Erreur `404` → endpoint non trouvé (API accessible mais endpoint incorrect)
   *          * Erreurs `400-499` → problème côté client (requête invalide)
   *          * Autres cas → erreur inattendue
   *      -> Met à jour `isAPIJoignable` et `errorMessage`
   */
  getAllMangas(): void {
    this.mangaService
      .getMangaSearch(this.currentPage().toString(), this.sizePage().toString())
      .subscribe({
        next: (response) => {
          // Succès - API accessible
          this.isAPIJoignable.set(true);
          this.mangaList.set(response);
          this.mangaCount.set(this.mangaList()!.pagination.items.total);
          this.floorMangaCount.set(Math.floor(this.mangaCount()! / 1000) * 1000);
          this.pageLoading.set(false);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des mangas:', error);
          this.pageLoading.set(false);

          // Vérifier le type d'erreur pour déterminer si l'API est joignable
          if (this.isNetworkError(error)) {
            this.isAPIJoignable.set(false);
            this.errorMessage.set(
              'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
            );
          } else if (error.status === 0) {
            // Erreur CORS ou serveur complètement inaccessible
            this.isAPIJoignable.set(false);
            this.errorMessage.set('Le serveur est inaccessible. Veuillez réessayer plus tard.');
          } else if (error.status >= 500) {
            // Erreur serveur
            this.isAPIJoignable.set(false);
            this.errorMessage.set(
              'Le serveur rencontre des difficultés. Veuillez réessayer plus tard.',
            );
          } else if (error.status === 404) {
            // Endpoint non trouvé - API joignable mais endpoint incorrect
            this.isAPIJoignable.set(true);
            this.errorMessage.set('Service non disponible. Les endpoint API ont peut-être changé.');
          } else if (error.status >= 400 && error.status < 500) {
            // Erreur client - API joignable mais problème avec la requête
            this.isAPIJoignable.set(true);
            this.errorMessage.set('Problème avec la requête. Veuillez réessayer.');
          } else {
            // Autres erreurs
            this.isAPIJoignable.set(false);
            this.errorMessage.set('Une erreur inattendue est survenue.');
          }
        },
      });
  }

  // Vérifier si c'est une erreur réseau
  isNetworkError(error: unknown): boolean {
    if (error instanceof HttpErrorResponse) {
      return (
        !navigator.onLine ||
        error.status === 0 ||
        error.message?.includes('Network') ||
        error.error instanceof ErrorEvent
      );
    }

    // fallback générique pour les autres types d'erreurs
    if (error instanceof Error) {
      return !navigator.onLine || error.message.includes('Network');
    }

    return !navigator.onLine;
  }

  /**
   * getStatusText
   * --------
   * Traduit le status récupérer de l'API en français
   *
   * Paramètre :
   * - status : status récupérer depuis l'API
   */
  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      Publishing: 'En cours',
      Finished: 'Terminé',
      'On Hiatus': 'En pause',
      Discontinued: 'Arrêté',
      Upcoming: 'à venir',
    };
    return statusMap[status] || status;
  }

  /**
   * getScoreColor
   * --------
   * Change la couleur du badge de score en fonction de ce dernier
   *
   * Paramètre :
   * - score : score récupérer depuis l'API
   */
  getScoreColor(score: number): string {
    if (score >= 8.5) return 'text-green-400';
    if (score >= 7.0) return 'text-yellow-400';
    if (score >= 5.0) return 'text-orange-400';
    return 'text-red-400';
  }

  /**
   * formatScore
   * --------
   * Formate le score, si pas de score alors on renvoie `N/A`
   *
   * Paramètre :
   * - score : score récupérer depuis l'API
   */
  formatScore(score: number): string {
    return score ? score.toFixed(1) : 'N/A';
  }

  /**
   * openDetails
   * --------
   * Ouvre le modal de détails d'un manga
   *
   * Paramètre :
   * - manga : Interface `MangaInfos`
   */
  openDetails(manga: MangaInfos) {
    // Mise à jour du signal du manga selectionné
    this.selectedManga.set(manga);

    // Affiche le modal de détails d'un manga
    this.showDetailsMangaModal.set(true);

    // Change le style du body afin d'enmêcher le scroll tant que le modal est ouvert
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  /**
   * closeDetails
   * --------
   * Ferme le modal de détails d'un manga
   */
  closeDetails() {
    // Masque le modal de détails d'un manga
    this.showDetailsMangaModal.set(false);

    // Mise à jour du signal du manga selectionné
    this.selectedManga.set(null);

    // Rétabli le style de la balise body
    this.renderer.removeStyle(document.body, 'overflow');
  }
  //#endregion

  //#region Ajout manga collection
  /**
   * openAddToCollectionModal
   * ------------------------
   * Ouvre le modal permettant d’ajouter un manga à une collection.
   *
   * Étapes :
   * 1. Empêche la propagation de l’événement (évite de déclencher un clic sur la carte du manga)
   * 2. Met à jour le signal `selectedMangaForCollection` avec le manga sélectionné
   * 3. Active l’affichage du modal (`showAddToCollectionModal`)
   * 4. Désactive le scroll du body pour forcer l’attention sur la modale
   *
   * Paramètres :
   * - manga : Interface MangaInfos -> manga sélectionné
   * - event : Event -> événement de clic déclencheur
   */
  openAddToCollectionModal(manga: MangaInfos, event: Event): void {
    event.stopPropagation(); // Empêcher la propagation vers la carte
    this.selectedMangaForCollection.set(manga);
    this.showAddToCollectionModal.set(true);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  /**
   * closeAddToCollectionModal
   * -------------------------
   * Ferme le modal d’ajout d’un manga à une collection.
   *
   * Étapes :
   * 1. Désactive l’affichage du modal (`showAddToCollectionModal`)
   * 2. Réinitialise `selectedMangaForCollection` à `null`
   * 3. Réactive le scroll sur le body
   */
  closeAddToCollectionModal(): void {
    this.showAddToCollectionModal.set(false);
    this.selectedMangaForCollection.set(null);
    this.renderer.removeStyle(document.body, 'overflow');
  }

  /**
   * onMangaAddedToCollection
   * ------------------------
   * Callback appelé après l’ajout réussi d’un manga à une collection.
   *
   * Étapes :
   * 1. Ferme le modal en appelant `closeAddToCollectionModal()`
   */
  onMangaAddedToCollection(): void {
    this.closeAddToCollectionModal();
  }
  //#endregion

  //#region Pagination
  /**
   * handlePageEvent
   * ---------------
   * Gère les événements de pagination (MatPaginator).
   *
   * Étapes :
   * 1. Calcule la page courante à partir de l’index du paginator (`pageIndex + 1`)
   * 2. Récupère la limite (taille de page) depuis `pageSize`
   * 3. Met à jour le signal `currentPage` avec l’index courant
   * 4. Appelle le service `mangaService.getMangaSearch` avec les paramètres `page` et `limit`
   *    - Met à jour la liste de mangas (`mangaList`) avec la réponse reçue
   * 5. Fait défiler la fenêtre en haut de la page avec un scroll fluide
   *
   * Paramètres :
   * - pageEvent : PageEvent -> objet d’événement provenant de MatPaginator
   */
  handlePageEvent(pageEvent: PageEvent) {
    const page = pageEvent.pageIndex + 1; // Index commence à 0 -> on ajoute 1
    const limit = pageEvent.pageSize; // Taille de la page choisie

    this.currentPage.set(pageEvent.pageIndex); // Met à jour la page courante

    this.mangaService.getMangaSearch(page.toString(), limit.toString()).subscribe((response) => {
      this.mangaList.set(response); // Met à jour la liste des mangas
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  //#endregion
}

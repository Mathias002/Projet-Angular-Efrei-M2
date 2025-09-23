// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../../features/auth/models/auth.model';
import { CollectionService } from '../../collections/services/collection.service';
import { Collection } from '../../collections/models/collection.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center"
      style="height: 100vh;"
    >
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div class="text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
            <h1 class="mt-4 text-3xl font-bold text-gray-900">
              Bienvenue {{ currentUser?.username }} !
            </h1>
            <p class="mt-2 text-lg text-gray-600">Gérez votre collection de manga</p>
          </div>

          <!-- Stats rapides -->
          <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Nombre de manga -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Manga</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ totalTomes }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Collections -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Collections</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ collectionCount }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Série du mois -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Favoris</dt>
                      <dd class="text-lg font-medium text-gray-900">-</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="mt-8 text-center">
            <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                type="button"
                routerLink="/mangas"
                class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
              >
                Ajouter un manga
              </button>
              <button
                type="button"
                routerLink="/collections"
                class="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 px-4 border border-gray-300 rounded-md transition duration-150 ease-in-out"
              >
                Créer une collection
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations utilisateur -->
      <div *ngIf="currentUser" class="mt-8 bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Informations de compte</h3>
          <div class="mt-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Nom d'utilisateur</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentUser.username }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentUser.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Rôle</dt>
                <dd class="mt-1">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ currentUser.role }}
                  </span>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  collectionsOfUser: Collection[] = [];
  collectionCount = 0;
  totalTomes = 0;

  currentUserId = '';

  constructor(
    private authService: AuthService,
    private collectionService: CollectionService,
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  private getCurrentUser(): void {
    // Récupérer l'ID de l'utilisateur connecté
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.currentUserId = user.id;
        this.getCollectionCount();
      }
    });
  }

  getCollectionCount(): void {
    if (!this.currentUserId) return;
    this.collectionService.getCollectionsByUser(this.currentUserId).subscribe({
      next: (collections) => {
        this.collectionsOfUser = collections;
        this.collectionCount = this.collectionsOfUser.length;
        // Une fois qu'on a les collections, on calcule les tomes
        this.getMangaCount();
      },
    });
  }

  getMangaCount(): void {
    this.totalTomes = this.collectionsOfUser.reduce((total, collection) => {
      return (
        total +
        collection.mangas.reduce((sum, manga) => sum + (manga.tomesPossedes?.length || 0), 0)
      );
    }, 0);
  }
}

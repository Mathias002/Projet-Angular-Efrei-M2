// navbar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/models/auth.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-200 fixed w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo et titre -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <a
                routerLink="/"
                routerLinkActive="bg-gray-100 text-indigo-700"
                class="text-gray-600 flex hover:text-gray-100 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                <div class="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    class="h-5 w-5 text-white"
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
                <h1 class="ml-3 text-xl font-bold text-gray-900">MangaCollection</h1>
              </a>
            </div>

            <!-- Navigation principale (si connecté) -->
            <div *ngIf="isAuthenticated" class="hidden md:block ml-10">
              <div class="flex items-baseline space-x-4">
                <a
                  routerLink="/collections"
                  routerLinkActive="bg-indigo-100 text-indigo-700"
                  class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Collections
                </a>
                <a
                  routerLink="/mangas"
                  routerLinkActive="bg-indigo-100 text-indigo-700"
                  class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Mangas
                </a>
                @if (currentUser?.role === 'admin') {
                  <a
                    routerLink="/admin"
                    routerLinkActive="bg-indigo-100 text-indigo-700"
                    class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  >
                    Administration
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Menu utilisateur -->
          <div class="flex items-center">
            <!-- Si connecté -->
            <div *ngIf="isAuthenticated" class="relative ml-3">
              <div class="flex items-center space-x-4">
                <!-- Infos utilisateur -->
                <div class="flex items-center space-x-3">
                  <div class="flex flex-col text-right">
                    <span class="text-sm font-medium text-gray-700">{{
                      currentUser?.username
                    }}</span>
                    <span class="text-xs text-gray-500">{{ currentUser?.email }}</span>
                  </div>
                  <div class="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-white">
                      {{ (currentUser?.username || 'U')[0].toUpperCase() }}
                    </span>
                  </div>
                </div>

                <!-- Menu déroulant -->
                <div class="relative">
                  <button
                    (click)="toggleDropdown()"
                    class="flex items-center text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  <!-- Dropdown menu -->
                  <div
                    *ngIf="showDropdown"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  >
                    <a
                      routerLink="/profile"
                      (click)="closeDropdown()"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                    >
                      <div class="flex items-center">
                        <svg
                          class="h-4 w-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                        Mon Profil
                      </div>
                    </a>
                    <a
                      routerLink="/settings"
                      (click)="closeDropdown()"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                    >
                      <div class="flex items-center">
                        <svg
                          class="h-4 w-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        Paramètres
                      </div>
                    </a>
                    <hr class="my-1" />
                    <button
                      (click)="logout()"
                      class="w-full text-left block px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition duration-150 ease-in-out"
                    >
                      <div class="flex items-center">
                        <svg
                          class="h-4 w-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
                        </svg>
                        Se déconnecter
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Si non connecté -->
            <div *ngIf="!isAuthenticated" class="flex items-center space-x-4">
              <a
                routerLink="/login"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                Connexion
              </a>
              <a
                routerLink="/register"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                S'inscrire
              </a>
            </div>

            <!-- Menu mobile -->
            <div class="md:hidden ml-4">
              <button
                (click)="toggleMobileMenu()"
                class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    *ngIf="!showMobileMenu"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                  <path
                    *ngIf="showMobileMenu"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu mobile -->
      <div *ngIf="showMobileMenu" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <!-- Navigation mobile si connecté -->
          <div *ngIf="isAuthenticated">
            <a
              routerLink="/dashboard"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-indigo-100 text-indigo-700"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
            >
              Dashboard
            </a>
            <a
              routerLink="/collections"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-indigo-100 text-indigo-700"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
            >
              Collections
            </a>
            <a
              routerLink="/manga"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-indigo-100 text-indigo-700"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
            >
              Manga
            </a>
            <hr class="my-3" />
            <a
              routerLink="/profile"
              (click)="closeMobileMenu()"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
            >
              Mon Profil
            </a>
            <button
              (click)="logout()"
              class="w-full text-left text-red-600 hover:text-red-900 hover:bg-red-50 block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
            >
              Se déconnecter
            </button>
          </div>

          <!-- Navigation mobile si non connecté -->
          <div *ngIf="!isAuthenticated">
            <a
              routerLink="/login"
              (click)="closeMobileMenu()"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
            >
              Connexion
            </a>
            <a
              routerLink="/register"
              (click)="closeMobileMenu()"
              class="bg-indigo-600 hover:bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
            >
              S'inscrire
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isAuthenticated = false;
  showDropdown = false;
  showMobileMenu = false;
  private subscriptions = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // S'abonner aux changements d'état d'authentification
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      }),
    );

    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe((authenticated) => {
        this.isAuthenticated = authenticated;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.closeDropdown();
    this.closeMobileMenu();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }
}

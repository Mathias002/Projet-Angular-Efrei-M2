// admin.component.ts
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, UserInfos } from '../services/admin.service';
import { RegisterComponent } from '../../auth/components/register/register.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Administration</h1>
              <p class="mt-2 text-gray-600">Gestion des utilisateurs</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <span class="text-sm text-gray-500">Total utilisateurs</span>
                <p class="text-2xl font-semibold text-indigo-600">{{ users().length }}</p>
              </div>
              <button
                (click)="refreshUsers()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                Actualiser
              </button>
            </div>
          </div>
        </div>

        <!-- Message de chargement -->
        <div *ngIf="loading()" class="text-center py-12">
          <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="mt-2 text-gray-500">Chargement des utilisateurs...</p>
        </div>

        <!-- Message d'erreur -->
        <div *ngIf="errorMessage()" class="mb-6 rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ errorMessage() }}</p>
            </div>
            <div class="ml-auto pl-3">
              <button
                (click)="errorMessage.set('')"
                class="inline-flex text-red-400 hover:text-red-600"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des utilisateurs -->
        <div
          *ngIf="!loading() && users().length > 0"
          class="bg-white shadow-sm rounded-lg overflow-hidden"
        >
          <div
            class="flex justify-between items-center align-center px-6 py-4 border-b border-gray-200"
          >
            <h2 class="text-lg font-medium text-gray-900">Liste des utilisateurs</h2>
            <button
              (click)="displayCreateUserModal()"
              class="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              title="Ajouter un utilisateur"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                <circle cx="10" cy="8" r="5"></circle>
                <path d="M19 16v6"></path>
                <path d="M22 19h-6"></path>
              </svg>
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Utilisateur
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rôle
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date création
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (user of users(); track user._id) {
                  <tr class="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <!-- Informations utilisateur -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <div
                            class="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center"
                          >
                            <span class="text-sm font-medium text-white">
                              {{ user.username[0].toUpperCase() }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                          <div class="text-sm text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>

                    <!-- Rôle -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class]="getRoleBadgeClass(user.role)"
                      >
                        {{ user.role }}
                      </span>
                    </td>

                    <!-- Date création -->
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.createdAt) }}
                    </td>

                    <!-- Statut -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        *ngIf="!user.deletedAt"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        <svg class="w-1.5 h-1.5 mr-1.5" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Actif
                      </span>
                      <span
                        *ngIf="user.deletedAt"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        <svg class="w-1.5 h-1.5 mr-1.5" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Supprimé
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <!-- Bouton détails -->
                        <button
                          (click)="showUserDetails(user)"
                          class="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                          title="Voir les détails"
                        >
                          <svg
                            class="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            ></path>
                          </svg>
                        </button>

                        <!-- Bouton supprimer (seulement si pas admin) -->
                        <button
                          *ngIf="user.role !== 'admin'"
                          (click)="confirmDeleteUser(user)"
                          class="inline-flex items-center p-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                          title="Supprimer l'utilisateur"
                        >
                          <svg
                            class="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>

                        <!-- Badge admin protégé -->
                        <span
                          *ngIf="user.role === 'admin'"
                          class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                          <svg
                            class="h-3 w-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            ></path>
                          </svg>
                          Protégé
                        </span>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Aucun utilisateur -->
        <div *ngIf="!loading() && users().length === 0" class="text-center py-12">
          <svg
            class="h-12 w-12 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
          <p class="mt-1 text-sm text-gray-500">
            Aucun utilisateur trouvé dans la base de données.
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div
      *ngIf="showDeleteModal()"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer l'utilisateur
                  <span class="font-semibold">{{ userToDelete()?.username }}</span> ?
                </p>
                <p class="text-sm text-gray-500 mt-1">Cette action est irréversible.</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              (click)="cancelDelete()"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Annuler
            </button>
            <button
              (click)="executeDelete()"
              [disabled]="deleting()"
              class="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <span *ngIf="deleting()" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Suppression...
              </span>
              <span *ngIf="!deleting()">Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal détails utilisateur -->
    <div
      *ngIf="selectedUser() && showDetailsModal()"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-900">Détails de l'utilisateur</h3>
            <button
              (click)="closeDetailsModal()"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Contenu -->
          <div class="mt-6">
            <!-- Avatar et nom -->
            <div class="flex items-center space-x-4 mb-6">
              <div class="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center">
                <span class="text-xl font-medium text-white">
                  {{ selectedUser()!.username[0].toUpperCase() }}
                </span>
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900">{{ selectedUser()!.username }}</h4>
                <p class="text-gray-600">{{ selectedUser()!.email }}</p>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2"
                  [class]="getRoleBadgeClass(selectedUser()!.role)"
                >
                  {{ selectedUser()!.role }}
                </span>
              </div>
            </div>

            <!-- Informations détaillées -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ID -->
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1">ID Utilisateur</span>
                <div class="p-3 bg-gray-50 rounded-md">
                  <code class="text-sm text-gray-900 font-mono">{{ selectedUser()!._id }}</code>
                </div>
              </div>

              <!-- Email -->
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1">Adresse email</span>
                <div class="p-3 bg-gray-50 rounded-md">
                  <span class="text-sm text-gray-900">{{ selectedUser()!.email }}</span>
                </div>
              </div>

              <!-- Rôle -->
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1">Rôle</span>
                <div class="p-3 bg-gray-50 rounded-md">
                  <span class="text-sm text-gray-900">{{ selectedUser()!.role }}</span>
                </div>
              </div>

              <!-- Date de création -->
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1">Date de création</span>
                <div class="p-3 bg-gray-50 rounded-md">
                  <span class="text-sm text-gray-900">{{
                    formatDate(selectedUser()!.createdAt)
                  }}</span>
                </div>
              </div>

              <!-- Date de mise à jour -->
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1"
                  >Dernière mise à jour</span
                >
                <div class="p-3 bg-gray-50 rounded-md">
                  <span class="text-sm text-gray-900">{{
                    formatDate(selectedUser()!.updatedAt)
                  }}</span>
                </div>
              </div>

              <!-- Date de suppression -->
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1"
                  >Date de suppression</span
                >
                <div class="p-3 bg-gray-50 rounded-md">
                  <span *ngIf="selectedUser()!.deletedAt" class="text-sm text-red-600">
                    {{ formatDate(selectedUser()!.deletedAt) }}
                  </span>
                  <span *ngIf="!selectedUser()!.deletedAt" class="text-sm text-gray-500 italic">
                    Non supprimé
                  </span>
                </div>
              </div>
            </div>

            <!-- Statut -->
            <div
              class="mt-6 p-4 border rounded-lg"
              [class]="
                selectedUser()!.deletedAt
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              "
            >
              <div class="flex items-center">
                <svg
                  *ngIf="!selectedUser()!.deletedAt"
                  class="h-5 w-5 text-green-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  *ngIf="selectedUser()!.deletedAt"
                  class="h-5 w-5 text-red-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span
                  class="text-sm font-medium"
                  [class]="selectedUser()!.deletedAt ? 'text-red-800' : 'text-green-800'"
                >
                  {{ selectedUser()!.deletedAt ? 'Utilisateur supprimé' : 'Utilisateur actif' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 flex justify-end">
            <button
              (click)="closeDetailsModal()"
              class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal création d'un utilisateur -->
    @if (showCreateUserModal()) {
      <div
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
          <div class="flex items-center justify-end">
            <button
              (click)="closeCreateUserModal()"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
            >
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <app-register></app-register>
        </div>
      </div>
    }
  `,
})
export class AdminComponent implements OnInit {
  // Signals
  users = signal<UserInfos[]>([]);
  selectedUser = signal<UserInfos | null>(null);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // État des modals
  showDeleteModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);
  showCreateUserModal = signal<boolean>(false);
  userToDelete = signal<UserInfos | null>(null);
  deleting = signal<boolean>(false);

  constructor(private adminService: AdminService) {}

  // Chargement des utilisateurs aux chargement de la page
  ngOnInit(): void {
    this.getAllUsers();
  }

  // Récupérer tout les utilisateurs
  getAllUsers(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(Array.isArray(users) ? users : [users]);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.errorMessage.set(error.message || 'Erreur lors du chargement des utilisateurs');
        this.loading.set(false);
      },
    });
  }

  // Refresh de la liste des utilisateurs
  refreshUsers(): void {
    this.getAllUsers();
  }

  // Afficher les détails d'un user
  showUserDetails(user: UserInfos): void {
    this.adminService.getUserById(user._id).subscribe({
      next: (userDetails) => {
        this.selectedUser.set(userDetails);
        this.showDetailsModal.set(true);
      },
      error: (err) => {
        console.error('Error getting user details:', err);
        this.errorMessage.set('Erreur lors du chargement des détails utilisateur');
      },
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedUser.set(null);
  }

  displayCreateUserModal(): void {
    this.showCreateUserModal.set(true);
  }

  closeCreateUserModal(): void {
    this.showCreateUserModal.set(false);
  }

  confirmDeleteUser(user: UserInfos): void {
    if (user.role === 'admin') {
      this.errorMessage.set('Impossible de supprimer un administrateur');
      return;
    }
    this.userToDelete.set(user);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.userToDelete.set(null);
  }

  executeDelete(): void {
    const user = this.userToDelete();
    if (!user) return;

    this.deleting.set(true);

    this.adminService.deleteUser(user._id).subscribe({
      next: () => {
        this.users.update((users) => users.filter((u) => u._id !== user._id));
        this.showDeleteModal.set(false);
        this.userToDelete.set(null);
        this.deleting.set(false);
        // console.log(`Utilisateur ${user.username} supprimé.`);
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.errorMessage.set('Désolé, la suppression a échoué');
        this.deleting.set(false);
      },
    });
  }

  // Reformatage de la date
  formatDate(dateString: string): string {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Style des badges par rôle
  getRoleBadgeClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { CollectionService } from '../../collections/services/collection.service';
import { AdminService } from '../../admin/services/admin.service';
import { ProfileService } from '../services/profile.service';
import { User } from '../../auth/models/auth.model';
import { Collection } from '../../collections/models/collection.model';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { updateUserRequest } from '../models/profile.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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
              Bienvenue {{ currentUser()!.username }} !
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
                      <dd class="text-lg font-medium text-gray-900">{{ totalTomes() }}</dd>
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
                      <dd class="text-lg font-medium text-gray-900">{{ collectionCount() }}</dd>
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
      <div *ngIf="currentUser()" class="mt-8 bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Informations de compte</h3>
            <div class="flex gap-6">
              <button class="cursor-pointer" (click)="openUpdateModal()">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.5rem"
                  viewBox="0 -960 960 960"
                  width="1.5rem"
                  fill="#3262cbff"
                >
                  <path
                    d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                  />
                </svg>
              </button>
              <button class="cursor-pointer" (click)="openDeleteModal()">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.5rem"
                  viewBox="0 -960 960 960"
                  width="1.5rem"
                  fill="#ff0000ff"
                >
                  <path
                    d="M538-538ZM424-424Zm56 264q51 0 98-15.5t88-44.5q-41-29-88-44.5T480-280q-51 0-98 15.5T294-220q41 29 88 44.5t98 15.5Zm106-328-57-57q5-8 8-17t3-18q0-25-17.5-42.5T480-640q-9 0-18 3t-17 8l-57-57q19-17 42.5-25.5T480-720q58 0 99 41t41 99q0 26-8.5 49.5T586-488Zm228 228-58-58q22-37 33-78t11-84q0-134-93-227t-227-93q-43 0-84 11t-78 33l-58-58q49-32 105-49t115-17q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 59-17 115t-49 105ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-59 16.5-115T145-701L27-820l57-57L876-85l-57 57-615-614q-22 37-33 78t-11 84q0 57 19 109t55 95q54-41 116.5-62.5T480-360q38 0 76 8t74 22l133 133q-57 57-130 87T480-80Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Nom d'utilisateur</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentUser()!.username }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentUser()!.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Rôle</dt>
                <dd class="mt-1">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ currentUser()!.role }}
                  </span>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="showUpdateModal()"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <form [formGroup]="userUpdateForm" (ngSubmit)="submitForm()">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Modifier vos informations</h3>

              <!-- Username -->
              <div class="mb-4">
                <span form class="block text-sm font-medium text-gray-700 mb-2">Username *</span>
                <input
                  type="text"
                  formControlName="username"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Votre username"
                />
                <div
                  *ngIf="username?.invalid && (username?.touched || username?.dirty)"
                  class="mt-1 text-sm text-red-600"
                >
                  <div *ngIf="username?.errors?.['required']">Le username est requis.</div>
                  <div *ngIf="username?.errors?.['minlength']">
                    Le username est trop court (min
                    {{ username?.errors?.['minlength']?.requiredLength }}).
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700 mb-2">Email *</span>
                <input
                  formControlName="email"
                  type="email"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Votre adresse email"
                />
                <div
                  *ngIf="email?.invalid && (email?.touched || email?.dirty)"
                  class="mt-1 text-sm text-red-600"
                >
                  <div *ngIf="email?.errors?.['required']">L'email est requis.</div>
                  <div *ngIf="email?.errors?.['email']">L'email n'est pas valide.</div>
                </div>
              </div>

              <!-- Ancien mot de passe (requis seulement si on change le mot de passe) -->
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700 mb-2"
                  >Ancien mot de passe</span
                >
                <input
                  type="password"
                  formControlName="oldPassword"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Mot de passe actuel (nécessaire pour changer)"
                />
                <div
                  *ngIf="
                    userUpdateForm.hasError('oldPasswordRequired') &&
                    (oldPassword?.touched || oldPassword?.dirty)
                  "
                  class="mt-1 text-sm text-red-600"
                >
                  Vous devez renseigner votre ancien mot de passe pour modifier le mot de passe.
                </div>
              </div>

              <!-- Nouveau mot de passe -->
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700 mb-2"
                  >Nouveau mot de passe</span
                >
                <input
                  type="password"
                  formControlName="newPassword"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
                />
                <div
                  *ngIf="newPassword?.invalid && (newPassword?.touched || newPassword?.dirty)"
                  class="mt-1 text-sm text-red-600"
                >
                  <div *ngIf="newPassword?.errors?.['minlength']">
                    Le mot de passe doit contenir au moins
                    {{ newPassword?.errors?.['minlength']?.requiredLength }} caractères.
                  </div>
                </div>
              </div>

              <!-- Confirmation du nouveau mot de passe -->
              <div class="mb-6">
                <span class="block text-sm font-medium text-gray-700 mb-2"
                  >Confirmer le nouveau mot de passe</span
                >
                <input
                  type="password"
                  formControlName="confirmPassword"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirmez le nouveau mot de passe"
                />
                <div
                  *ngIf="
                    userUpdateForm.hasError('passwordsMismatch') &&
                    (confirmPassword?.touched || confirmPassword?.dirty)
                  "
                  class="mt-1 text-sm text-red-600"
                >
                  Les mots de passe ne correspondent pas.
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  (click)="cancelUpdate()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  [disabled]="userUpdateForm.invalid || updating()"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
                >
                  <span *ngIf="updating()" class="flex items-center">
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Modification...
                  </span>
                  <span *ngIf="!updating()">Modifier</span>
                </button>
              </div>
            </div>
          </form>
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
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                <p class="text-sm text-gray-500 mt-2">
                  Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
                </p>
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
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  // ✅ Signals pour gérer les états réactifs
  currentUser = signal<User | null>(null);
  collectionsOfUser = signal<Collection[]>([]);
  collectionCount = signal(0);
  totalTomes = signal(0);

  userUpdateForm!: FormGroup;

  showDeleteModal = signal(false);
  deleting = signal(false);
  showUpdateModal = signal(false);
  updating = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private collectionService: CollectionService,
    private adminService: AdminService,
    private profileService: ProfileService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  private getCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser.set(user);
        this.getCollectionCount(user._id);
        this.initForm(user);
      }
    });
  }

  private getCollectionCount(userId: string): void {
    this.collectionService.getCollectionsByUser(userId).subscribe({
      next: (collections) => {
        this.collectionsOfUser.set(collections);
        this.collectionCount.set(collections.length);
        this.getMangaCount();
      },
    });
  }

  private getMangaCount(): void {
    const total = this.collectionsOfUser().reduce((total, collection) => {
      return (
        total +
        collection.mangas.reduce((sum, manga) => sum + (manga.tomesPossedes?.length || 0), 0)
      );
    }, 0);
    this.totalTomes.set(total);
  }

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
  }

  openUpdateModal(): void {
    this.showUpdateModal.set(true);
  }

  cancelUpdate(): void {
    this.showUpdateModal.set(false);
  }

  private initForm(user: User): void {
    this.userUpdateForm = this.fb.group(
      {
        username: [user.username, [Validators.required, Validators.minLength(2)]],
        email: [user.email, [Validators.required, Validators.email]],
        oldPassword: [''],
        newPassword: ['', [Validators.minLength(6)]],
        confirmPassword: [''],
      },
      {
        validators: [this.passwordsMatchValidator(), this.requireOldPasswordIfNewValidator()],
      },
    );
  }

  get username() {
    return this.userUpdateForm.get('username');
  }
  get email() {
    return this.userUpdateForm.get('email');
  }
  get oldPassword() {
    return this.userUpdateForm.get('oldPassword');
  }
  get newPassword() {
    return this.userUpdateForm.get('newPassword');
  }
  get confirmPassword() {
    return this.userUpdateForm.get('confirmPassword');
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const newP = group.get('newPassword')?.value;
      const confirmP = group.get('confirmPassword')?.value;

      // si aucun password renseigné on ne signale pas d'erreur
      if (!newP && !confirmP) return null;

      return newP === confirmP ? null : { passwordsMismatch: true };
    };
  }

  private requireOldPasswordIfNewValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const newP = group.get('newPassword')?.value;
      const oldP = group.get('oldPassword')?.value;

      if (newP && !oldP) return { oldPasswordRequired: true };
      return null;
    };
  }

  submitForm(): void {
    if (this.userUpdateForm.invalid || !this.currentUser()) return;

    this.updating.set(true);
    const formData = this.userUpdateForm.value;

    const updateData: updateUserRequest = {
      username: formData.username,
      email: formData.email,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    this.profileService.updateUser(this.currentUser()!._id, updateData).subscribe({
      next: (updatedUser) => {
        // ✅ On met à jour l'état local
        this.currentUser.set(updatedUser);
        this.authService.setCurrentUser(updatedUser); // pour mettre à jour le BehaviorSubject global
        this.showUpdateModal.set(false);
        this.updating.set(false);
      },
      error: (err) => {
        console.error('Erreur de mise à jour :', err);
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue');
        this.updating.set(false);
      },
    });
  }

  executeDelete(): void {
    const user = this.currentUser();
    if (!user) return;

    this.deleting.set(true);
    this.errorMessage.set(null);

    this.adminService.deleteUser(user._id).subscribe({
      next: () => {
        // ✅ On réinitialise l'utilisateur et on redirige
        this.currentUser.set(null);
        this.showDeleteModal.set(false);
        this.deleting.set(false);
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur de suppression :', err);
        this.errorMessage.set('Désolé, la suppression a échoué.');
        this.deleting.set(false);
      },
    });
  }
}

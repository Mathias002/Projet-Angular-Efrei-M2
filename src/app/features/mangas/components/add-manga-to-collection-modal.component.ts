// add-manga-to-collection-modal.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CollectionService } from '../../collections/services/collection.service';
import { AuthService } from '../../auth/services/auth.service';
import { MangaInfos } from '../models/manga.model';
import { Collection, MangaCollection } from '../../collections/models/collection.model';

@Component({
  selector: 'app-add-manga-to-collection-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <!-- Modal backdrop -->
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <form [formGroup]="addMangaForm" (ngSubmit)="submitForm()">
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Ajouter à une collection</h3>
              <button
                type="button"
                (click)="closeModal.emit()"
                class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Manga info -->
            <div *ngIf="manga" class="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <img
                [src]="manga.images.webp.image_url"
                [alt]="manga.title"
                class="w-16 h-24 object-cover rounded shadow-sm"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 truncate">{{ manga.title }}</h4>
                <p
                  *ngIf="manga.title_english && manga.title_english !== manga.title"
                  class="text-sm text-gray-600 truncate"
                >
                  {{ manga.title_english }}
                </p>
                <div class="flex items-center mt-1 text-xs text-gray-500">
                  <span>{{ manga.volumes || '?' }} vol.</span>
                  <span *ngIf="manga.chapters" class="ml-2">{{ manga.chapters }} ch.</span>
                </div>
              </div>
            </div>

            <!-- Message d'erreur -->
            <div *ngIf="errorMessage" class="mb-4 rounded-md bg-red-50 p-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>

            <!-- Sélection de collection -->
            <div class="mb-4">
              <span class="block text-sm font-medium text-gray-700 mb-2">
                Choisir une collection *
              </span>
              <select
                formControlName="collectionId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                [class.border-red-500]="
                  addMangaForm.get('collectionId')?.invalid &&
                  addMangaForm.get('collectionId')?.touched
                "
              >
                <option value="">Sélectionnez une collection</option>
                <option *ngFor="let collection of collections" [value]="collection._id">
                  {{ collection.name }}
                </option>
              </select>
              <div
                *ngIf="
                  addMangaForm.get('collectionId')?.invalid &&
                  addMangaForm.get('collectionId')?.touched
                "
                class="mt-1 text-sm text-red-600"
              >
                Veuillez sélectionner une collection
              </div>
            </div>

            <!-- Gestion des tomes -->
            <div class="mb-6">
              <span class="block text-sm font-medium text-gray-700 mb-2"> Tomes possédés </span>

              <!-- Mode de saisie -->
              <div class="flex space-x-4 mb-3">
                <span class="flex items-center">
                  <input
                    type="radio"
                    value="individual"
                    formControlName="volumeInputMode"
                    (change)="changeVolumeMode()"
                    class="text-indigo-600 focus:ring-indigo-500"
                    name="volumeInputMode"
                  />
                  <span class="ml-2 text-sm text-gray-700">Saisie individuelle</span>
                </span>
                <span class="flex items-center">
                  <input
                    type="radio"
                    value="range"
                    formControlName="volumeInputMode"
                    (change)="changeVolumeMode()"
                    class="text-indigo-600 focus:ring-indigo-500"
                    name="volumeInputMode"
                  />
                  <span class="ml-2 text-sm text-gray-700">Plage (ex: 1-5)</span>
                </span>
              </div>

              <!-- Saisie individuelle -->
              <div *ngIf="volumeInputMode === 'individual'">
                <div class="flex items-center space-x-2 mb-2">
                  <input
                    type="number"
                    #volumeInput
                    min="1"
                    placeholder="N° du tome"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    (click)="addVolume(volumeInput)"
                    class="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Saisie par plage -->
              <div *ngIf="volumeInputMode === 'range'" class="space-y-2">
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    #rangeStart
                    min="1"
                    placeholder="Début"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    style="width: 6rem;"
                  />
                  <span class="text-gray-500">à</span>
                  <input
                    type="number"
                    #rangeEnd
                    min="1"
                    placeholder="Fin"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    style="width: 6rem;"
                  />
                  <button
                    type="button"
                    (click)="addVolumeRange(rangeStart, rangeEnd)"
                    class="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <!-- Liste des tomes sélectionnés -->
              <div *ngIf="selectedVolumes.length > 0" class="mt-3">
                <div class="flex flex-wrap gap-2">
                  <span
                    *ngFor="let volume of selectedVolumes; trackBy: trackByVolume"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    Tome {{ volume }}
                    <button
                      type="button"
                      (click)="removeVolume(volume)"
                      class="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                </div>
                <p class="mt-2 text-xs text-gray-500">
                  {{ selectedVolumes.length }} tome(s) sélectionné(s)
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                (click)="closeModal.emit()"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Annuler
              </button>
              <button
                type="submit"
                [disabled]="addMangaForm.invalid || submitting || selectedVolumes.length === 0"
                class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                <span *ngIf="submitting" class="flex items-center">
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
                  Ajout...
                </span>
                <span *ngIf="!submitting">Ajouter à la collection</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AddMangaToCollectionModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() manga: MangaInfos | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() mangaAdded = new EventEmitter<{ collection: Collection; manga: MangaInfos }>();

  addMangaForm!: FormGroup;
  collections: Collection[] = [];
  selectedVolumes: number[] = [];

  submitting = false;
  errorMessage = '';
  currentUserId = '';

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCurrentUser();
  }

  ngOnChanges(): void {
    if (this.isOpen && this.currentUserId) {
      this.loadUserCollections();
      this.resetForm();
    }
  }

  private initForm(): void {
    this.addMangaForm = this.fb.group({
      collectionId: ['', Validators.required],
      volumeInputMode: ['individual'], // ✅ ajout du formControl
    });
  }

  get volumeInputMode(): 'individual' | 'range' {
    return this.addMangaForm.get('volumeInputMode')?.value;
  }

  private getCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserId = user._id;
      }
    });
  }

  private loadUserCollections(): void {
    if (!this.currentUserId) return;

    this.collectionService.getCollectionsByUser(this.currentUserId).subscribe({
      next: (collections) => {
        this.collections = collections || [];
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des collections';
        console.error('Erreur collections:', error);
      },
    });
  }

  private resetForm(): void {
    this.addMangaForm.reset();
    this.selectedVolumes = [];
    this.errorMessage = '';
  }

  changeVolumeMode(): void {
    // Réinitialiser la sélection lors du changement de mode
  }

  addVolume(input: HTMLInputElement): void {
    const volume = parseInt(input.value);
    if (volume && volume > 0 && !this.selectedVolumes.includes(volume)) {
      this.selectedVolumes.push(volume);
      this.selectedVolumes.sort((a, b) => a - b);
      input.value = '';
    }
  }

  addVolumeRange(startInput: HTMLInputElement, endInput: HTMLInputElement): void {
    const start = parseInt(startInput.value);
    const end = parseInt(endInput.value);

    if (start && end && start > 0 && end > 0 && start <= end) {
      for (let i = start; i <= end; i++) {
        if (!this.selectedVolumes.includes(i)) {
          this.selectedVolumes.push(i);
        }
      }
      this.selectedVolumes.sort((a, b) => a - b);
      startInput.value = '';
      endInput.value = '';
    }
  }

  removeVolume(volume: number): void {
    this.selectedVolumes = this.selectedVolumes.filter((v) => v !== volume);
  }

  trackByVolume(index: number, volume: number): number {
    return volume;
  }

  submitForm(): void {
    if (this.addMangaForm.invalid || !this.manga || this.selectedVolumes.length === 0) return;

    this.submitting = true;
    this.errorMessage = '';

    const mangaToAdd: MangaCollection = {
      idManga: this.manga.mal_id,
      tomesPossedes: this.selectedVolumes,
    };

    const collectionId = this.addMangaForm.value.collectionId;

    this.collectionService.addMangaToCollection(collectionId, mangaToAdd).subscribe({
      next: (updatedCollection) => {
        const collection = this.collections.find((c) => c._id === collectionId);
        if (collection) {
          this.mangaAdded.emit({ collection: updatedCollection, manga: this.manga! });
        }
        this.close();
        this.submitting = false;
      },
      error: (error) => {
        this.errorMessage =
          error.message || 'Ajout du manga en base de données interrompu. Une erreur est survenue';
        this.submitting = false;
      },
    });
  }

  close(): void {
    this.closeModal.emit();
    this.resetForm();
  }
}

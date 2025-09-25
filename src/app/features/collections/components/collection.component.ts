// collections.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from '../services/collection.service';
import { AuthService } from '../../auth/services/auth.service';
import {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from '../models/collection.model';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collection.component.html',
})
export class CollectionsComponent implements OnInit {
  //#region Signals
  // Signal Collection
  collections = signal<Collection[]>([]);

  // Signal current user
  currentUserId = signal<string>('');

  // Signal de message d'erreur
  errorMessage = signal<string>('');

  // Affichage des Modals
  showModalEditCreate = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);

  // État des modals
  loading = signal<boolean>(false);
  editingCollection = signal<Collection | null>(null);
  collectionToDelete = signal<Collection | null>(null);
  selectedCollection = signal<Collection | null>(null);

  // Actions
  activeMenuId = signal<string>('');
  submitting = signal<boolean>(false);
  deleting = signal<boolean>(false);
  //#endregion

  //#region Formulaire
  // FormGroup
  collectionForm!: FormGroup;
  //#endregion

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  // Récupération du currentUser, chargements des collections et initialisations des formulaires
  ngOnInit(): void {
    this.initForm();
    this.getCurrentUser();
    this.loadCollections();
  }

  //#region Formulaire
  /**
   * initForm
   * --------
   * Initialise le formulaire d'ajout et de mise à jour d'une collection.
   *
   * Champs :
   * - name : string → Nom de la collection (obligatoire)
   * - description : string → description de la collection (facultatif)
   *
   * Validators :
   * - `Validators.required` → le champ ne peut pas être vide
   */
  private initForm(): void {
    this.collectionForm = this.fb.group({
      name: ['', Validators.required], // champ obligatoire
      description: [''],
    });
  }

  /**
   * submitForm
   * -----------
   * Soumet le formulaire de collection :
   * - Si `editingCollection` est défini -> met à jour une collection existante
   * - Sinon -> crée une nouvelle collection
   *
   * Étapes :
   * 1. Vérifie si le formulaire est valide
   *    - Si invalide -> on sort de la methode
   * 2. Active l’indicateur `submitting`
   * 3. Prépare les données à envoyer (`updateData` ou `createData`)
   * 4. Appelle le service (`updateCollection` ou `createCollection`)
   * 5. Gestion de la réponse :
   *    - Succès :
   *        - Met à jour ou ajoute la collection dans `collections`
   *        - Ferme le modal
   *        - Désactive `submitting`
   *    - Erreur :
   *        - Stocke le message d’erreur
   *        - Désactive `submitting`
   */
  submitForm(): void {
    if (this.collectionForm.invalid) return;

    this.submitting.set(true);
    const formData = this.collectionForm.value;

    if (this.editingCollection) {
      // Modification
      const updateData: UpdateCollectionRequest = {
        name: formData.name,
        description: formData.description || undefined,
      };

      this.collectionService.updateCollection(this.editingCollection()!._id, updateData).subscribe({
        next: (updatedCollection) => {
          const index = this.collections().findIndex(
            (c) => c._id === this.editingCollection()!._id,
          );
          if (index > -1) {
            this.collections()[index] = updatedCollection;
          }
          this.closeModal();
          this.submitting.set(false);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.submitting.set(false);
        },
      });
    } else {
      // Création
      const createData: CreateCollectionRequest = {
        name: formData.name,
        description: formData.description || undefined,
        userId: this.currentUserId(),
      };

      this.collectionService.createCollection(createData).subscribe({
        next: (newCollection) => {
          this.collections().unshift(newCollection);
          this.closeModal();
          this.submitting.set(false);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.submitting.set(false);
        },
      });
    }
  }
  //#endregion

  //#region Current User
  /**
   * getCurrentUser
   * --------------
   * Récupère l'identifiant de l'utilisateur actuellement connecté
   * via l'Observable `currentUser$` du service d'authentification.
   *
   * Étapes :
   * 1. Abonement à `authService.currentUser$` pour récupérer les informations de l'utilisateur
   * 2. Si un utilisateur est présent :
   *    - Met à jour le Signal `currentUserId` avec son identifiant (`_id`)
   */
  private getCurrentUser(): void {
    // Récupérer l'ID de l'utilisateur connecté
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserId.set(user._id);
      }
    });
  }
  //#endregion

  //#region Collections
  /**
   * loadCollections
   * ----------------
   * Charge toutes les collections de l’utilisateur connecté.
   *
   * Étapes :
   * 1. Vérifie si `currentUserId` est défini
   *    - Si absent -> sortie immédiate (aucun appel inutile)
   * 2. Active l’indicateur de chargement (`loading`)
   * 3. Réinitialise le message d’erreur
   * 4. Appelle `collectionService.getCollectionsByUser` pour récupérer les collections
   * 5. Gestion de la réponse :
   *    - Succès : met à jour `collections` et désactive le chargement
   *    - Erreur : log l’erreur, met à jour `errorMessage` et désactive le chargement
   */
  loadCollections(): void {
    if (!this.currentUserId) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.collectionService.getCollectionsByUser(this.currentUserId()).subscribe({
      next: (collections) => {
        this.collections.set(collections || null);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
        console.error('Erreur lors du chargement des collections:', error);
      },
    });
  }

  /**
   * openCreateModal
   * --------
   * Ouvre le modal d'ajout d'une collection
   */
  openCreateModal(): void {
    this.editingCollection.set(null);
    this.collectionForm.reset();
    this.showModalEditCreate.set(true);
    this.activeMenuId.set('');
  }

  /**
   * editCollection
   * --------------
   * Prépare l’édition d’une collection existante et ouvre la modale d’édition/création.
   *
   * Étapes :
   * 1. Met à jour le signal `editingCollection` avec la collection sélectionnée
   * 2. Pré-remplit le formulaire (`collectionForm`) avec les valeurs de la collection
   *    - `name` : nom de la collection
   *    - `description` : description (chaîne vide si absente)
   * 3. Force la mise à jour de l’ID dans `editingCollection` (sécurité)
   * 4. Affiche le modal d’édition/création (`showModalEditCreate`)
   * 5. Réinitialise `activeMenuId` pour fermer tout menu contextuel ouvert
   *
   * Paramètres :
   * - collection : Interface Collection -> la collection à modifier
   */
  editCollection(collection: Collection): void {
    this.editingCollection.set(collection);
    this.collectionForm.patchValue({
      name: collection.name,
      description: collection.description || '',
    });
    this.editingCollection()!._id = collection._id;
    this.showModalEditCreate.set(true);
    this.activeMenuId.set('');
  }

  /**
   * closeDetailsModal
   * --------
   * Fermeture du modal d'ajout et de modification d'une collection
   */
  closeModal(): void {
    this.showModalEditCreate.set(false);
    this.editingCollection.set(null);
    this.collectionForm.reset();
  }

  /**
   * viewCollection
   * --------
   * Affichage du modal de details d'une collection
   */
  viewCollection(collection: Collection): void {
    this.selectedCollection.set(collection);
    this.showDetailsModal.set(true);
    this.activeMenuId.set('');
  }

  /**
   * closeDetailsModal
   * --------
   * Fermeture du modal de details d'une collection
   */
  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedCollection.set(null);
  }

  /**
   * toggleActionsMenu
   * --------
   * Affiche le menu dropdownd'une collection (détail, modification, suppression)
   */
  toggleActionsMenu(collectionId: string): void {
    this.activeMenuId.set(this.activeMenuId() === collectionId ? '' : collectionId);
  }

  /**
   * confirmDelete
   * --------
   * Confirmation de la suppression d'une collection
   *
   * Paramètre :
   * - user : Interface `Collection`
   */
  confirmDelete(collection: Collection): void {
    // Mise à jour du signal de la collection à supprimer
    this.collectionToDelete.set(collection);

    // Affichage du modal de suppression d'une collection
    this.showDeleteModal.set(true);

    // Reinitialisation du signal du menu dropdown
    this.activeMenuId.set('');
  }

  /**
   * cancelDelete
   * --------
   * Annulation de la suppression d'une collection
   */
  cancelDelete(): void {
    // Masquage du modal de suppression d'une collection
    this.showDeleteModal.set(false);

    // Reinitialisation du signal de la collection à supprimer
    this.collectionToDelete.set(null);
  }

  /**
   * executeDelete
   * -------------
   * Supprime une collection sélectionnée via le service `collectionService`.
   *
   * Étapes :
   * 1. Vérifie qu'une collection est sélectionnée
   *    - Si aucune collection n'est sélectionnée, la méthode s'arrête
   * 2. Active le flag `deleting` pour indiquer que l'opération est en cours
   * 3. Appelle la méthode `deleteCollection` du service Angular avec l'identifiant de la collection
   * 4. En cas de succès :
   *    - Met à jour la liste des collections (`collections`) en retirant la collection supprimée
   *    - Appelle `cancelDelete()` pour réinitialiser la sélection et fermer la modale
   *    - Réinitialise le flag `deleting`
   * 5. En cas d'erreur :
   *    - Met à jour `errorMessage` pour informer l'utilisateur
   *    - Réinitialise le flag `deleting`
   */
  executeDelete(): void {
    if (!this.collectionToDelete) return; // Vérifie qu'une collection est sélectionnée

    this.deleting.set(true); // Indique que la suppression est en cours

    this.collectionService.deleteCollection(this.collectionToDelete()!._id).subscribe({
      next: () => {
        // Retire la collection supprimée de la liste
        this.collections.set(
          this.collections().filter((c) => c._id !== this.collectionToDelete()!._id),
        );

        this.cancelDelete(); // Réinitialise la sélection et ferme la modale
        this.deleting.set(false); // Réinitialise le signal
      },
      error: (error) => {
        this.errorMessage = error.message; // Message d'erreur utilisateur
        this.deleting.set(false); // Réinitialise le signal
      },
    });
  }

  /**
   * formatDate
   * --------
   * Permet de formater la date renseigner en paramètre
   *
   * Paramètre :
   * - dateString : string
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * getTotalVolumes
   * ---------------
   * Calcule le nombre total de tomes possédés dans une collection de mangas.
   *
   * Paramètres :
   * - collection : Interface `Collection`
   *
   * Retour :
   * - number -> nombre total de tomes possédés
   */
  getTotalVolumes(collection: Collection): number {
    if (!collection.mangas) return 0; // Pas de mangas -> 0 tomes
    return collection.mangas.reduce((total, manga) => {
      return total + (manga.tomesPossedes?.length || 0); // Additionne les tomes de chaque manga
    }, 0);
  }
  //#endregion

  //#region Document click
  /**
   * onDocumentClick
   * ---------------
   * Ferme les menus ouverts lorsque l'utilisateur clique en dehors d'eux.
   *
   * Paramètres :
   * - event : Event -> événement de clic du document
   */
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.activeMenuId.set('');
    }
  }
  //#endregion
}

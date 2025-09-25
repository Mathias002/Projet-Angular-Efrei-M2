// add-manga-to-collection-modal.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CollectionService } from '../../../collections/services/collection.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MangaInfos } from '../../models/manga.model';
import { Collection, MangaCollection } from '../../../collections/models/collection.model';

@Component({
  selector: 'app-add-manga-to-collection-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-manga-to-collection-modal.component.html',
})
export class AddMangaToCollectionModalComponent implements OnInit, OnChanges {
  //#region Decorator (notification template parent -> manga.component)
  @Input() isOpen = false;
  @Input() manga: MangaInfos | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() mangaAdded = new EventEmitter<{ collection: Collection; manga: MangaInfos }>();
  //#endregion

  //#region Signal
  // Signal Collection
  collections = signal<Collection[]>([]);

  // Signal manga volumes selectionné
  selectedVolumes = signal<number[]>([]);

  // Etat du modal
  submitting = signal<boolean>(false);

  // Signal current user
  currentUserId = signal<string>('');

  // Signal de message d'erreur
  errorMessage = signal<string>('');
  //#endregion

  //#region Formulaire
  //FormGroup
  addMangaForm!: FormGroup;
  //#endregion

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private authService: AuthService,
  ) {}

  // Récupération du currentUser et initialisation des formulaires
  ngOnInit(): void {
    this.initForm();
    this.getCurrentUser();
  }

  //#region Formulaire

  /**
   * initForm
   * --------
   * Initialise le formulaire d'ajout d'un manga à une collection.
   *
   * Champs :
   * - collectionId : string → Id de la collection (obligatoire)
   * - volumeInputMode : string → selection du mode d'ajout (individual ou plage)
   *
   * Validators :
   * - `Validators.required` → le champ ne peut pas être vide
   */
  private initForm(): void {
    this.addMangaForm = this.fb.group({
      collectionId: ['', Validators.required], // champ obligatoire
      volumeInputMode: ['individual'],
    });
  }

  submitForm(): void {
    if (this.addMangaForm.invalid || !this.manga || this.selectedVolumes.length === 0) return;

    this.submitting.set(true);
    this.errorMessage.set('');

    const mangaToAdd: MangaCollection = {
      idManga: this.manga.mal_id,
      tomesPossedes: this.selectedVolumes(),
    };

    const collectionId = this.addMangaForm.value.collectionId;

    this.collectionService.addMangaToCollection(collectionId, mangaToAdd).subscribe({
      next: (updatedCollection) => {
        const collection = this.collections().find((c) => c._id === collectionId);
        if (collection) {
          this.mangaAdded.emit({ collection: updatedCollection, manga: this.manga! });
        }
        this.close();
        this.submitting.set(false);
      },
      error: (error) => {
        this.errorMessage =
          error.message || 'Ajout du manga en base de données interrompu. Une erreur est survenue';
        this.submitting.set(false);
      },
    });
  }

  /**
   * ngOnChanges
   * --------
   * Ouvre le modal d'ajout d'un manga à une collection et reset le formulaire
   */
  ngOnChanges(): void {
    if (this.isOpen && this.currentUserId()) {
      this.loadUserCollections();
      this.resetForm();
    }
  }

  /**
   * close
   * --------
   * Ferme le modal d'ajout d'un manga à une collection et reset le formulaire
   */
  close(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  /**
   * resetForm
   * --------
   * Reinitialise le formulaire, les volumes selectionées précedement et le message d'erreurs
   */
  private resetForm(): void {
    this.addMangaForm.reset();
    this.selectedVolumes.set([]);
    this.errorMessage.set('');
  }

  //#region Volume

  /**
   * addVolume
   * ---------
   * Ajoute un tome à la liste des volumes sélectionnés (`selectedVolumes`).
   *
   * Étapes :
   * 1. Convertit la valeur de l'input en nombre entier
   * 2. Vérifie que le volume est :
   *    - défini et supérieur à 0
   *    - non déjà présent dans la liste `selectedVolumes`
   * 3. Si valide :
   *    - Ajoute le volume à la liste
   *    - Trie la liste par ordre croissant
   *    - Réinitialise le champ `input` à vide
   *
   * Paramètres :
   * - input : HTMLInputElement -> inpu de saisie du numéro du tome
   */
  addVolume(input: HTMLInputElement): void {
    const volume = parseInt(input.value);
    if (volume && volume > 0 && !this.selectedVolumes().includes(volume)) {
      this.selectedVolumes().push(volume);
      this.selectedVolumes().sort((a, b) => a - b);
      input.value = '';
    }
  }

  /**
   * addVolumeRange
   * ---------------
   * Ajoute une plage de tomes à la liste des volumes sélectionnés (`selectedVolumes`).
   *
   * Étapes :
   * 1. Convertit les valeurs des deux inputs (`startInput` et `endInput`) en nombre entiers
   * 2. Vérifie que :
   *    - Les deux valeurs existent
   *    - Les deux sont positives
   *    - `start` est inférieur ou égal à `end`
   * 3. Parcourt la plage entre `start` et `end` inclus
   *    - Ajoute chaque tome absent de `selectedVolumes`
   * 4. Trie la liste des tomes sélectionnés par ordre croissant
   * 5. Réinitialise les deux champs `input`
   *
   * Paramètres :
   * - startInput : HTMLInputElement -> input de saisie du tome de début
   * - endInput   : HTMLInputElement -> input de saisie du tome de fin
   */
  addVolumeRange(startInput: HTMLInputElement, endInput: HTMLInputElement): void {
    const start = parseInt(startInput.value);
    const end = parseInt(endInput.value);

    if (start && end && start > 0 && end > 0 && start <= end) {
      for (let i = start; i <= end; i++) {
        if (!this.selectedVolumes().includes(i)) {
          this.selectedVolumes().push(i);
        }
      }
      this.selectedVolumes().sort((a, b) => a - b);
      startInput.value = '';
      endInput.value = '';
    }
  }

  /**
   * removeVolume
   * --------
   * Retire un volume de la liste des volumes selectionnées (`selectedVolumes`).
   *
   * Paramètres :
   * - volume : HTMLInputElement -> input de saisie du tome de début
   */
  removeVolume(volume: number): void {
    this.selectedVolumes.set(this.selectedVolumes().filter((v) => v !== volume));
  }

  changeVolumeMode(): void {
    // Réinitialiser la sélection lors du changement de mode
  }

  /**
   * volumeInputMode
   * --------
   * Récupère le mode d'ajout des volumes d'un manga
   *
   * @returns `individual` | `range`
   */
  get volumeInputMode(): 'individual' | 'range' {
    return this.addMangaForm.get('volumeInputMode')?.value;
  }

  //#endregion

  //#endregion

  //#region User

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
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserId.set(user._id);
      }
    });
  }

  //#endregion

  //#region Collection

  /**
   * loadUserCollections
   * -------------------
   * Charge les collections appartenant à l'utilisateur connecté.
   *
   * Étapes :
   * 1. Vérifie que l'ID utilisateur (`currentUserId`) est bien défini
   *    - Si non, on arrête la fonction
   * 2. Appelle `getCollectionsByUser` depuis `collectionService`
   *    - Passe en paramètre l'ID utilisateur
   * 3. Souscription à l'observable :
   *    - next :
   *      -> Met à jour le signal `collections` avec la liste reçue
   *    - error :
   *      -> Met à jour le signal `errorMessage` avec un message utilisateur
   *      -> Log l'erreur complète dans la console pour debug
   */
  private loadUserCollections(): void {
    if (!this.currentUserId) return; // Vérifie que l'utilisateur est bien identifié

    this.collectionService.getCollectionsByUser(this.currentUserId()).subscribe({
      next: (collections) => {
        this.collections.set(collections); // Met à jour les collections utilisateur
      },
      error: (error) => {
        this.errorMessage.set('Erreur lors du chargement des collections'); // Message utilisateur
        console.error('Erreur collections:', error); // Log technique
      },
    });
  }

  //#endregion
}

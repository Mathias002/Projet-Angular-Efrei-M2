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
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  //#region Signal
  // Collections du current user
  collectionsOfUser = signal<Collection[]>([]);

  // Current user
  currentUser = signal<User | null>(null);

  // Statistiques du current user
  collectionCount = signal(0);
  totalTomes = signal(0);

  // Etat Modal
  deleting = signal(false);
  updating = signal(false);

  // Message d'erreur
  errorMessage = signal<string | null>(null);

  // Affichage des modals
  showDeleteModal = signal(false);
  showUpdateModal = signal(false);
  //#endregion

  //#region Formulaire
  // Forulaire de modification du current user
  userUpdateForm!: FormGroup;
  //#endregion

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private collectionService: CollectionService,
    private adminService: AdminService,
    private profileService: ProfileService,
    private router: Router,
  ) {}

  // On récupère l'utilisateur connecté
  ngOnInit(): void {
    this.getCurrentUser();
  }

  //#region Formulaire
  /**
   * Initialiser le formulaire de mise à jour utilisateur
   * ---------------------------------------------------
   * - Pré-remplissage des champs `username` et `email` avec les infos de l’utilisateur
   * - Définit les contraintes de validation (taille minimale, email valide, etc.)
   * - Ajoute des validateurs personnalisés :
   *    `passwordsMatchValidator` : vérifie que `newPassword` et `confirmPassword` sont identiques
   *    `requireOldPasswordIfNewValidator` : oblige à renseigner `oldPassword` si un `newPassword` est saisi
   */
  private initForm(user: User): void {
    this.userUpdateForm = this.fb.group(
      {
        username: [user.username, [Validators.required, Validators.minLength(2)]], // champ obligatoire, minimun 2 caractères
        email: [user.email, [Validators.required, Validators.email]], // champ obligatoire, doit être un email valide
        oldPassword: [''], // champ obligatoire si `newPassword` est renseigné
        newPassword: ['', [Validators.minLength(6)]], // champ optionel, minimun 2 caractères
        confirmPassword: [''],
      },
      {
        validators: [this.passwordsMatchValidator(), this.requireOldPasswordIfNewValidator()],
      },
    );
  }

  /**
   * Mettre à jour les informations du profil utilisateur
   * ----------------------------------------------------
   * - Vérifie que le formulaire est valide et qu’un utilisateur courant existe
   * - Construit l’objet `updateUserRequest` à partir du formulaire
   * - Appelle le service `profileService.updateUser`
   * - Si succès :
   *    -> Met à jour l’état local (`currentUser`)
   *    -> Met à jour le BehaviorSubject global via `authService`
   *    -> Ferme la modal
   *    -> Réinitialise l’état `updating`
   * - Si échec :
   *    -> Affiche un message d’erreur
   *    -> Réinitialise l’état `updating`
   */
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
        this.currentUser.set(updatedUser);
        this.authService.setCurrentUser(updatedUser); // pour mettre à jour le BehaviorSubject global
        this.showUpdateModal.set(false);
        this.updating.set(false);
      },
      error: (err) => {
        console.error('Erreur de mise à jour :', err);
        this.errorMessage.set(err || 'Une erreur est survenue');
        this.updating.set(false);
      },
    });
  }

  /**
   * Supprimer le compte utilisateur courant
   * ---------------------------------------
   * - Vérifie que l'utilisateur courant existe
   * - Lance l'appel API pour supprimer l'utilisateur via `adminService`
   * - Si succès :
   *    -> Réinitialise `currentUser`
   *    -> Ferme la modal de confirmation
   *    -> Déclenche la déconnexion (`authService.logout`)
   *    -> Redirige vers la page de connexion
   * - Si échec :
   *    -> Affiche un message d'erreur
   *    -> Réinitialise l'état de chargement (`deleting`)
   */
  executeDelete(): void {
    const user = this.currentUser();
    if (!user) return;

    this.deleting.set(true);
    this.errorMessage.set(null);

    this.adminService.deleteUser(user._id).subscribe({
      next: () => {
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

  /**
   * openDeleteModal
   * --------
   * Ouvre le modal de suppression d'un utilisateur
   */
  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  /**
   * openUpdateModal
   * --------
   * Ouvre le modal de mise à jour d'un utilisateur
   */
  openUpdateModal(): void {
    this.showUpdateModal.set(true);
  }

  /**
   * cancelDelete
   * --------
   * Ferme le modal de suppression d'un utilisateur
   */
  cancelDelete(): void {
    this.showDeleteModal.set(false);
  }

  /**
   * cancelUpdate
   * --------
   * Ferme le modal de mise à jour d'un utilisateur
   */
  cancelUpdate(): void {
    this.showUpdateModal.set(false);
  }
  //#endregion

  //#region User
  /**
   * getCurrentUser
   * --------------
   * Récupère l'utilisateur actuellement connecté
   * via l'Observable `currentUser$` du service d'authentification.
   *
   * Étapes :
   * 1. Abonement à `authService.currentUser$` pour récupérer les informations de l'utilisateur
   * 2. Si un utilisateur est présent :
   *    - Met à jour le Signal `currentUser` avec les informations de l'utilisateur
   *    - Appelle la method `getCollectionCount` en passant en paramètre l'id de l'utilisateur
   *    - Initialise le formulaire de modification avec les informations de l'utilisateur
   */
  private getCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser.set(user);
        this.getCollectionCount(user._id);
        this.initForm(user);
      }
    });
  }

  /**
   * Getters de contrôles de formulaire
   * ----------------------------------
   * Ces getters permettent d’accéder plus facilement aux champs du
   * formulaire `userUpdateForm` dans le template.
   *
   */
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
  //#endregion

  //#region Statistiques
  /**
   * Récupére le nombre de collections d’un utilisateur
   * ---------------------------------------------------
   * - Appelle le service `collectionService.getCollectionsByUser(userId)`
   * - Met à jour le signal `collectionsOfUser` avec la liste des collections
   * - Met à jour le signal `collectionCount` avec le total
   * - Déclenche ensuite `getMangaCount()` pour calculer le nombre de mangas associés
   *
   * Paramètre : userId -> L’identifiant unique de l’utilisateur
   */
  private getCollectionCount(userId: string): void {
    this.collectionService.getCollectionsByUser(userId).subscribe({
      next: (collections) => {
        this.collectionsOfUser.set(collections);
        this.collectionCount.set(collections.length);
        this.getMangaCount();
      },
    });
  }

  /**
   * Récupére le nombre total de tomes possédés
   * -------------------------------------------
   * - Parcourt toutes les collections de l’utilisateur
   * - Additionne pour chaque manga le nombre de `tomesPossedes`
   * - Met à jour le signal `totalTomes` avec le résultat final
   */
  private getMangaCount(): void {
    const total = this.collectionsOfUser().reduce((total, collection) => {
      return (
        total +
        collection.mangas.reduce((sum, manga) => sum + (manga.tomesPossedes?.length || 0), 0)
      );
    }, 0);
    this.totalTomes.set(total);
  }
  //#endregion

  //#region Validator Formulaire
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
  //#endregion
}

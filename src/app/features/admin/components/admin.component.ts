// admin.component.ts
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { RegisterComponent } from '../../auth/components/register/register.component';
import { UpdateRoleRequest, UserInfos } from '../models/admin.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RegisterComponent, ReactiveFormsModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  //#region Signal

  // Signals relatif a/aux utilisateurs
  users = signal<UserInfos[]>([]);
  selectedUser = signal<UserInfos | null>(null);
  userToDelete = signal<UserInfos | null>(null);
  userToUpdate = signal<UserInfos | null>(null);

  // Signal de message d'erreur
  errorMessage = signal<string>('');

  // État des modals
  loading = signal<boolean>(false);
  updating = signal<boolean>(false);
  deleting = signal<boolean>(false);

  // Affichage des Modals
  showDetailsModal = signal<boolean>(false);
  showCreateUserModal = signal<boolean>(false);
  showUpdateModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);

  //#endregion

  //#region Formulaire

  // Initialisation du FormGroup
  userUpdateRoleForm!: FormGroup;

  //#endregion

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
  ) {}

  // Récupération des utilisateurs et initialisations des formulaires
  ngOnInit(): void {
    this.initForm();
    this.getAllUsers();
  }

  //#region Formulaire

  /**
   * initForm
   * --------
   * Initialise le formulaire de mise à jour du rôle utilisateur.
   *
   * Champs :
   * - selectUserRole : string → rôle sélectionné (obligatoire)
   *
   * Validators :
   * - `Validators.required` → le champ ne peut pas être vide
   */
  private initForm(): void {
    this.userUpdateRoleForm = this.fb.group({
      selectUserRole: ['', Validators.required], // champ obligatoire
    });
  }

  /**
   * submitForm
   * ----------
   * Envoie le formulaire de mise à jour du rôle utilisateur.
   *
   * Étapes :
   * 1. Vérifie que le formulaire est valide et qu'un utilisateur est sélectionné
   *    - Si formulaire invalide ou aucun utilisateur sélectionné, la méthode s'arrête
   * 2. Active le signal `updating` pour indiquer que l'opération est en cours
   * 3. Récupère les données du formulaire (`formData`)
   * 4. Construit l'objet `updateData` de type `UpdateRoleRequest` avec :
   *    - username et email de l'utilisateur sélectionné
   *    - rôle sélectionné dans le formulaire
   * 5. Appelle le service `adminService.updateRoleUser` pour mettre à jour le rôle
   * 6. En cas de succès :
   *    - Ferme le modal de mise à jour
   *    - Réinitialise le signal `updating`
   *    - Rafraîchit la liste des utilisateurs via `refreshUsers()`
   * 7. En cas d'erreur :
   *    - Affiche l'erreur dans la console pour debug
   *    - Met à jour `errorMessage` pour informer l'utilisateur
   *    - Réinitialise le signal `updating`
   */
  submitForm(): void {
    // Vérifie la validité du formulaire et la sélection de l'utilisateur
    if (this.userUpdateRoleForm.invalid || !this.selectedUser()) return;

    this.updating.set(true); // Indique que la mise à jour est en cours

    const formData = this.userUpdateRoleForm.value;

    // Construction de l'objet UpdateRoleRequest
    const updateData: UpdateRoleRequest = {
      username: this.selectedUser()?.username,
      email: this.selectedUser()?.email,
      role: formData.selectUserRole,
    };

    // Appel du service pour mettre à jour le rôle
    this.adminService.updateRoleUser(this.selectedUser()!._id, updateData).subscribe({
      next: () => {
        this.showUpdateModal.set(false); // Ferme la modale
        this.updating.set(false); // Réinitialise le flag d'état
        this.refreshUsers(); // Rafraîchit la liste des utilisateurs
      },
      error: (err) => {
        console.error('Erreur de mise à jour :', err); // Log de l'erreur pour debug
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue'); // Message utilisateur
        this.updating.set(false); // Réinitialise le flag d'état
      },
    });
  }

  //#endregion

  //#region allUsers

  /**
   * getAllUsers
   * --------
   * Récupération de tout les utilisateurs actifs
   */
  getAllUsers(): void {
    // Mise à jours des signals d'état et de message d'erreur
    this.loading.set(true);
    this.errorMessage.set('');

    // Appel de la methode getAllUsers() de adminService afin de récupérer tout les utilisateurs actif
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        // Mise à jour du signal `users` avec le tableau des utilisateurs récupéré
        this.users.set(Array.isArray(users) ? users : [users]);

        // Mise à jour des signals d'état suite à la fin du traitement
        this.loading.set(false);
      },
      error: (error) => {
        // Gestion des erreurs avec description en console et mise à jours du signal `errorMessage`
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.errorMessage.set(error.message || 'Erreur lors du chargement des utilisateurs');

        // Mise à jour des signals d'état suite à la fin du traitement
        this.loading.set(false);
      },
    });
  }

  /**
   * refreshUsers
   * --------
   * Refresh de la liste des utilisateurs
   */
  refreshUsers(): void {
    this.getAllUsers();
  }

  //#endregion

  //#region userDetails

  /**
   * showUserDetails
   * --------
   * Afficher les détails d'un utilisateur
   *
   * Paramètre :
   * - user : Interface `UserInfos`
   *
   */
  showUserDetails(user: UserInfos): void {
    // Appel de la methode getUserById() de adminService afin de récupérer l'utilisateur
    this.adminService.getUserById(user._id).subscribe({
      next: (userDetails) => {
        // Mise à jour du signal de l'utilisateur selectioné
        this.selectedUser.set(userDetails);

        // Affichage du modal de details d'un utilisateur
        this.showDetailsModal.set(true);
      },
      error: (err) => {
        // Gestion des erreurs avec description en console et mise à jours du signal `errorMessage`
        console.error('Error getting user details:', err);
        this.errorMessage.set('Erreur lors du chargement des détails utilisateur');
      },
    });
  }

  /**
   * closeDetailsModal
   * --------
   * Fermeture du modal de détail et réinitialisation du signal `selectedUser`
   */
  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedUser.set(null);
  }

  //#endregion

  //#region createUser

  /**
   * displayCreateUserModal
   * --------
   * Affichage du modal de création d'un utilisateur
   */
  displayCreateUserModal(): void {
    this.showCreateUserModal.set(true);
  }

  /**
   * closeCreateUserModal
   * --------
   * Fermeture du modal de création d'un utilisateur
   */
  closeCreateUserModal(): void {
    this.showCreateUserModal.set(false);
  }

  //#endregion createUSer

  //#region updateUser

  /**
   * displayUpdateUserRoleModal
   * --------
   *
   * Affichage du modal de modification du rôle d'un utilisateur
   *
   * Paramètre :
   * - user : Interface `UserInfos`
   */
  displayUpdateUserRoleModal(user: UserInfos): void {
    // Mise à jour du signal de l'utilisateur selectioné
    this.selectedUser.set(user);

    // Vérifie que le formulaire est bien initialisé
    if (this.userUpdateRoleForm) {
      // Récupère le rôle actuel de l'utilisateur et met à jour le champ `selectUserRole` du formulaire
      const role = user.role ?? '';
      this.userUpdateRoleForm.patchValue({ selectUserRole: role });
    }

    // Affichage du modal de modification d'un utilisateur
    this.showUpdateModal.set(true);
  }

  /**
   * closeUpdateUserRoleModal
   * --------
   * Fermeture du modal de modification du rôle d'un utilisateur
   */
  closeUpdateUserRoleModal(): void {
    this.showUpdateModal.set(false);
  }

  //#endregion

  //#region deleteUser

  /**
   * confirmDeleteUser
   * --------
   * Confirmation de la suppression d'un utilisateur
   *
   * Paramètre :
   * - user : Interface `UserInfos`
   */
  confirmDeleteUser(user: UserInfos): void {
    // Vérifie si l'utilisateur à le rôle `admin` auquel cas il sera impossible de le supprimer
    if (user.role === 'admin') {
      this.errorMessage.set('Impossible de supprimer un administrateur');
      return;
    }

    // Mise à jour du signal de l'utilisateur à supprimer
    this.userToDelete.set(user);

    // Affichage du modal de suppression d'un utilisateur
    this.showDeleteModal.set(true);
  }

  /**
   * cancelDelete
   * --------
   * Annulation de la suppression d'un utilisateur
   *
   */
  cancelDelete(): void {
    // Masquage du modal de suppression d'un utilisateur
    this.showDeleteModal.set(false);

    // Reinitialisation du signam de l'utilisateur à supprimer
    this.userToDelete.set(null);
  }

  /**
   * executeDelete
   * -------------
   * Supprime un utilisateur sélectionné via le service `adminService`.
   *
   * Étapes :
   * 1. Récupère l'utilisateur à supprimer depuis `userToDelete`
   * 2. Si aucun utilisateur n'est sélectionné, la méthode s'arrête
   * 3. Active le signal `deleting` pour indiquer que l'opération est en cours
   * 4. Appelle la méthode `deleteUser` du service `adminService`
   * 5. En cas de succès :
   *    - Met à jour la liste des utilisateurs (`users`) en retirant l'utilisateur supprimé
   *    - Ferme la modale de suppression
   *    - Réinitialise `userToDelete` et `deleting`
   * 6. En cas d'erreur :
   *    - Affiche l'erreur dans la console
   *    - Met à jour `errorMessage` pour informer l'utilisateur
   *    - Réinitialise le signal `deleting`
   */
  executeDelete(): void {
    const user = this.userToDelete();
    if (!user) return; // Aucun utilisateur sélectionné → arrêt

    this.deleting.set(true); // Indique que la suppression est en cours

    this.adminService.deleteUser(user._id).subscribe({
      next: () => {
        // Mise à jour de la liste des utilisateurs pour retirer l'utilisateur supprimé
        this.users.update((users) => users.filter((u) => u._id !== user._id));

        this.showDeleteModal.set(false); // Ferme le modal
        this.userToDelete.set(null); // Réinitialise l'utilisateur sélectionné
        this.deleting.set(false); // Réinitialise le signal d'état
      },
      error: (err) => {
        console.error('Error deleting user:', err); // Log de l'erreur pour debug
        this.errorMessage.set('Désolé, la suppression a échoué'); // Message utilisateur
        this.deleting.set(false); // Réinitialise le signal d'état
      },
    });
  }

  //#endregion

  //#region other

  /**
   * formatDate
   * --------
   * Permet de formater la date renseigner en paramètre
   *
   * Paramètre :
   * - dateString : string
   */
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

  /**
   * getRoleBadgeClass
   * --------
   * Permet de changer le style des badges pour les rôles des utilisateurs
   *
   * Paramètre :
   * - role : string
   */
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

  //#endregion
}

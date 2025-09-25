/**
 * updateUserRequest
 * -----------------
 * Représente la structure des données envoyées
 * lors de la mise à jour d’un utilisateur.
 *
 * Propriétés :
 * - username        : nom d’utilisateur (obligatoire)
 * - email           : adresse email (obligatoire)
 * - oldPassword     : ancien mot de passe (optionnel, requis si changement de mot de passe)
 * - newPassword     : nouveau mot de passe (optionnel, requis si changement de mot de passe)
 * - confirmPassword : confirmation du nouveau mot de passe (optionnel, doit correspondre à `newPassword`)
 */
export interface updateUserRequest {
  username: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/**
 * updateUserResponse
 * ------------------
 * Représente la structure des données renvoyées
 * après une mise à jour réussie d’un utilisateur.
 *
 * Propriétés :
 * - _id        : identifiant unique de l’utilisateur
 * - username   : nom d’utilisateur
 * - email      : adresse email
 * - role       : rôle attribué à l’utilisateur (ex : "user" ou "admin")
 * - deletedAt  : date de suppression logique (null si actif)
 * - createdAt  : date de création du compte
 * - updatedAt  : date de dernière mise à jour
 */
export interface updateUserResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

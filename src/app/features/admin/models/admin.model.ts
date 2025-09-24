/**
 * UserInfos
 * ---------
 * Interface représentant les informations complètes d'un utilisateur
 * telles qu'elles sont renvoyées par l'API.
 *
 * Contient :
 * - Identifiant unique (_id)
 * - Informations personnelles (username, email)
 * - Rôle (user, admin)
 * - Dates importantes (création, mise à jour, suppression)
 */
export interface UserInfos {
  _id: string;
  username: string;
  email: string;
  role: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * UpdateRoleRequest
 * -----------------
 * Interface utilisée pour mettre à jour le rôle d'un utilisateur.
 *
 * - username ou email peuvent être fournis pour identifier l'utilisateur
 * - role est obligatoire
 */
export interface UpdateRoleRequest {
  username?: string;
  email?: string;
  role: string;
}

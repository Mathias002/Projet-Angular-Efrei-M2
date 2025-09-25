/**
 * Collection
 * ---------
 * Interface représentant les informations complètes d'une collection
 * telles qu'elles sont renvoyées par l'API.
 *
 * Contient :
 * - Identifiant unique (_id)
 * - Informations principale (name, description)
 * - Utilisateur rattaché (userId)
 * - Mangas affilié (mangas)
 * - Dates importantes (création, mise à jour, suppression)
 */
export interface Collection {
  _id: string;
  name: string;
  description: string;
  userId: string;
  mangas: MangaCollection[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

/**
 * CreateCollectionRequest
 * -----------------
 * Interface utilisée pour créer une collection.
 *
 * - name et userId sont obligatoire
 * - description est optionel
 */
export interface CreateCollectionRequest {
  name: string;
  description?: string;
  userId: string;
}

/**
 * CreateCollectionRequest
 * -----------------
 * Interface utilisée pour mettre à jour une collection.
 *
 * - name est obligatoire
 * - description est optionel
 */
export interface UpdateCollectionRequest {
  name: string;
  description?: string;
}

/**
 * MangaCollection
 * ---------
 * Interface représentant les informations d'un manga
 *
 * Contient :
 * - Identifiant unique du manga au sein de l'API externe (idManga)
 * - Liste des tommes possédés (tomesPossedes)
 */
export interface MangaCollection {
  idManga: number;
  tomesPossedes: number[];
}

/**
 * UpdateMangaCollection
 * -----------------
 * Interface utilisée pour mettre à jour un manga dans une collection.
 *
 * - tomesPossedes est optionel
 */
export interface UpdateMangaCollection {
  tomesPossedes: number[];
}

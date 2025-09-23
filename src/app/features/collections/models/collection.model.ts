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

export interface MangaCollection {
  idManga: number;
  tomesPossedes: number[];
}

export interface UpdateMangaCollection {
  tomesPossedes: number[];
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  userId: string;
}

export interface UpdateCollectionRequest {
  name: string;
  description?: string;
}

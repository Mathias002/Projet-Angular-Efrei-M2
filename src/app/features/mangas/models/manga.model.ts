/**
 * MangaInfos
 * ----------
 * Représente les informations des mangas renvoyées par l’API.
 */
export interface MangaInfos {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  approved: boolean;
  title: string;
  title_english?: string;
  title_japanese?: string;
  type: string;
  chapters?: number;
  volumes?: number;
  popularity: number;
  rank: number;
  status: string;
  published: {
    from: string;
    to: string;
    prop: {
      from: {
        day: number;
        month: number;
        year: number;
      };
      to: {
        day: number;
        month: number;
        year: number;
      };
    };
    string: string;
  };
  score: number;
  scored_by?: number;
  synopsis?: string;
  authors: { mal_id: number; name: string; url: string }[];
  genres: { mal_id: number; name: string; url: string }[];
  themes: { mal_id: number; name: string; url: string }[];
  demographics: { mal_id: number; name: string; url: string }[];
}

/**
 * Pagination
 * ----------
 * Représente les informations de pagination renvoyées par l’API.
 *
 * Propriétés :
 * - last_visible_page : numéro de la dernière page visible
 * - has_next_page     : indique s’il existe une page suivante
 * - current_page      : numéro de la page actuelle
 * - items             : détails sur les éléments paginés
 *    - count   : nombre d’éléments renvoyés dans cette page
 *    - total   : nombre total d’éléments disponibles
 *    - per_page: nombre d’éléments par page
 */
export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

/**
 * MangaListResponse
 * -----------------
 * Représente la structure complète de la réponse API
 * lors de la récupération d’une liste de mangas.
 *
 * Propriétés :
 * - pagination : métadonnées de pagination
 * - data       : tableau contenant les mangas (MangaInfos[])
 */
export interface MangaListResponse {
  pagination: Pagination;
  data: MangaInfos[];
}

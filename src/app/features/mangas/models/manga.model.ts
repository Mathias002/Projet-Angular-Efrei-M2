// Interface les infos des mangas
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

// Interface pour la pagination
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

// Interface pour la réponse complète
export interface MangaListResponse {
  pagination: Pagination;
  data: MangaInfos[];
}

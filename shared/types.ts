export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  status?: string;
  genres?: Genre[];
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: Genre[];
  status?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  credits?: Credits;
  status: string;
  budget?: number;
  revenue?: number;
}

export interface TVShowDetails extends TVShow {
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  credits?: Credits;
  status: string;
  created_by?: {
    id: number;
    name: string;
    profile_path: string | null;
  }[];
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type ContentType = 'movie' | 'tv';

export interface FilterParams {
  genre?: number;
  year?: number;
  type?: ContentType;
  query?: string;
  page?: number;
}

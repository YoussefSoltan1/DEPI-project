import { ApiResponse, Movie, TVShow, MovieDetails, TVShowDetails, FilterParams } from "@shared/types";

// Get trending movies
export const getTrendingMovies = async (page = 1): Promise<ApiResponse<Movie>> => {
  const response = await fetch(`/api/movies/trending?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }
  return response.json();
};

// Get trending TV shows
export const getTrendingTVShows = async (page = 1): Promise<ApiResponse<TVShow>> => {
  const response = await fetch(`/api/tv/trending?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch trending TV shows');
  }
  return response.json();
};

// Get movie details
export const getMovieDetails = async (id: string): Promise<MovieDetails> => {
  const response = await fetch(`/api/movies/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }
  return response.json();
};

// Get TV show details
export const getTVShowDetails = async (id: string): Promise<TVShowDetails> => {
  const response = await fetch(`/api/tv/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch TV show details');
  }
  return response.json();
};

// Get genres
export const getGenres = async (type: 'movie' | 'tv') => {
  const response = await fetch(`/api/genres/${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} genres`);
  }
  return response.json();
};

// Search
export const searchContent = async (query: string, type = 'multi', page = 1) => {
  const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&type=${type}&page=${page}`);
  if (!response.ok) {
    throw new Error('Search failed');
  }
  return response.json();
};

// Discover movies with filters
export const discoverMovies = async (filters: FilterParams) => {
  const params = new URLSearchParams();
  if (filters.genre) params.append('genre', filters.genre.toString());
  if (filters.year) params.append('year', filters.year.toString());
  if (filters.page) params.append('page', filters.page.toString());
  
  const response = await fetch(`/api/discover/movies?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to discover movies');
  }
  return response.json();
};

// Discover TV shows with filters
export const discoverTVShows = async (filters: FilterParams) => {
  const params = new URLSearchParams();
  if (filters.genre) params.append('genre', filters.genre.toString());
  if (filters.year) params.append('year', filters.year.toString());
  if (filters.page) params.append('page', filters.page.toString());
  
  const response = await fetch(`/api/discover/tv?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to discover TV shows');
  }
  return response.json();
};

// Get popular movies
export const getPopularMovies = async (page = 1): Promise<ApiResponse<Movie>> => {
  const response = await fetch(`/api/movies/popular?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }
  return response.json();
};

// Get popular TV shows
export const getPopularTVShows = async (page = 1): Promise<ApiResponse<TVShow>> => {
  const response = await fetch(`/api/tv/popular?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch popular TV shows');
  }
  return response.json();
};

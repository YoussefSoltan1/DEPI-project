import { Express } from "express";
import axios from "axios";
import { ApiResponse, Movie, TVShow, MovieDetails, TVShowDetails, FilterParams } from "@shared/types";

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Create axios instance for TMDB API
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export function setupTmdbRoutes(app: Express) {
  // Get trending movies
  app.get('/api/movies/trending', async (req, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const response = await tmdbApi.get<ApiResponse<Movie>>('/trending/movie/week', {
        params: { page },
      });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Get trending TV shows
  app.get('/api/tv/trending', async (req, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const response = await tmdbApi.get<ApiResponse<TVShow>>('/trending/tv/week', {
        params: { page },
      });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Get movie details
  app.get('/api/movies/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await tmdbApi.get<MovieDetails>(`/movie/${id}`, {
        params: {
          append_to_response: 'credits,videos,images',
        },
      });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Get TV show details
  app.get('/api/tv/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await tmdbApi.get<TVShowDetails>(`/tv/${id}`, {
        params: {
          append_to_response: 'credits,videos,images',
        },
      });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Get all genres
  app.get('/api/genres/:type', async (req, res, next) => {
    try {
      const { type } = req.params;
      if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ message: 'Invalid type, must be "movie" or "tv"' });
      }
      
      const response = await tmdbApi.get(`/genre/${type}/list`);
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Search movies and TV shows
  app.get('/api/search', async (req, res, next) => {
    try {
      const { query, type = 'movie', page = 1 } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }
      
      if (type !== 'movie' && type !== 'tv' && type !== 'multi') {
        return res.status(400).json({ message: 'Invalid type, must be "movie", "tv" or "multi"' });
      }
      
      const response = await tmdbApi.get(`/search/${type}`, {
        params: {
          query,
          page,
        },
      });
      
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Discover movies with filters
  app.get('/api/discover/movies', async (req, res, next) => {
    try {
      const { genre, year, page = 1 } = req.query;
      
      const params: Record<string, any> = { 
        page, 
        sort_by: 'popularity.desc',
      };
      
      if (genre) params.with_genres = genre;
      if (year) params.primary_release_year = year;
      
      const response = await tmdbApi.get('/discover/movie', { params });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Discover TV shows with filters
  app.get('/api/discover/tv', async (req, res, next) => {
    try {
      const { genre, year, page = 1 } = req.query;
      
      const params: Record<string, any> = { 
        page, 
        sort_by: 'popularity.desc',
      };
      
      if (genre) params.with_genres = genre;
      if (year) params.first_air_date_year = year;
      
      const response = await tmdbApi.get('/discover/tv', { params });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Popular movies
  app.get('/api/movies/popular', async (req, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const response = await tmdbApi.get<ApiResponse<Movie>>('/movie/popular', {
        params: { page },
      });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  // Popular TV shows
  app.get('/api/tv/popular', async (req, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const response = await tmdbApi.get<ApiResponse<TVShow>>('/tv/popular', {
        params: { page },
      });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });
}

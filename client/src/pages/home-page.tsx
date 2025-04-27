import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Movie, TVShow, FilterParams, Genre } from '@shared/types';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import ContentGrid from '@/components/content-grid';
import FilterBar from '@/components/filter-bar';
import PromoSection from '@/components/promo-section';
import Footer from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTrendingTVShows, 
  getGenres 
} from '@/lib/api';
import { Loader2, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});

  // Query for genres
  const { data: movieGenres } = useQuery({
    queryKey: ['/api/genres/movie'],
    queryFn: () => getGenres('movie'),
  });

  // Query for trending movies
  const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['/api/movies/trending'],
    queryFn: () => getTrendingMovies(),
  });

  // Query for popular movies
  const { data: popularMovies, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['/api/movies/popular'],
    queryFn: () => getPopularMovies(),
  });

  // Query for trending TV shows
  const { data: trendingTVShows, isLoading: isLoadingTVShows } = useQuery({
    queryKey: ['/api/tv/trending'],
    queryFn: () => getTrendingTVShows(),
  });

  // Set a featured movie from trending for the hero section
  useEffect(() => {
    if (trendingMovies?.results && trendingMovies.results.length > 0) {
      // Find a movie with a backdrop image
      const moviesWithBackdrop = trendingMovies.results.filter(
        (movie) => movie.backdrop_path !== null
      );
      
      if (moviesWithBackdrop.length > 0) {
        // Pick a random movie with backdrop
        const randomIndex = Math.floor(Math.random() * moviesWithBackdrop.length);
        setFeaturedMovie(moviesWithBackdrop[randomIndex]);
      } else {
        setFeaturedMovie(trendingMovies.results[0]);
      }
    }
  }, [trendingMovies]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  return (
    <div className="min-h-screen bg-primary text-textPrimary">
      <Navbar />
      
      {/* Hero Section */}
      {featuredMovie ? (
        <HeroSection movie={featuredMovie} />
      ) : (
        <div className="relative h-[500px] md:h-[600px] bg-hoverBg flex items-center justify-center">
          <Skeleton className="h-full w-full absolute" />
          <Loader2 className="h-12 w-12 animate-spin text-secondary absolute" />
        </div>
      )}
      
      {/* Filter Bar */}
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        genres={movieGenres?.genres || []}
      />
      
      {/* Popular Movies Section */}
      <section className="py-10 container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Popular Movies</h2>
          <a href="/movies" className="text-secondary hover:text-red-400 transition-colors duration-200 flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        
        {isLoadingPopular ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-hoverBg rounded-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ContentGrid 
            items={popularMovies?.results || []} 
            type="movie" 
          />
        )}
      </section>
      
      {/* Trending TV Shows Section */}
      <section className="py-10 container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Trending TV Shows</h2>
          <a href="/tv" className="text-secondary hover:text-red-400 transition-colors duration-200 flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        
        {isLoadingTVShows ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-hoverBg rounded-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ContentGrid 
            items={trendingTVShows?.results || []} 
            type="tv" 
          />
        )}
      </section>
      
      {/* Promo Section */}
      <PromoSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

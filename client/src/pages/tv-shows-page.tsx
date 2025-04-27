import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { FilterParams, TVShow } from '@shared/types';
import { discoverTVShows, getGenres } from '@/lib/api';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ContentGrid from '@/components/content-grid';
import FilterBar from '@/components/filter-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const TvShowsPage = () => {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<FilterParams>({
    type: 'tv',
    page: 1,
  });

  // Get TV shows based on filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/discover/tv', filters],
    queryFn: () => discoverTVShows(filters),
    keepPreviousData: true,
  });

  // Get genres for the filter dropdown
  const { data: genresData } = useQuery({
    queryKey: ['/api/genres/tv'],
    queryFn: () => getGenres('tv'),
  });

  // Handle filters change
  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    // Reset to page 1 when changing filters
    if (newFilters.genre !== undefined || newFilters.year !== undefined) {
      setFilters({ ...filters, ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, ...newFilters });
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.total_pages || 1)) {
      setFilters({ ...filters, page: newPage });
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto py-10 px-4 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Error Loading TV Shows</h2>
          <p className="text-textSecondary mb-6">Something went wrong. Please try again later.</p>
          <Button onClick={() => window.location.reload()} className="bg-secondary hover:bg-red-700">
            Retry
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-hoverBg py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">TV Shows</h1>
          <p className="text-textSecondary mt-2">Browse our collection of TV series</p>
        </div>
      </div>
      
      {/* Filters */}
      <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        genres={genresData?.genres || []}
        contentType="tv"
      />
      
      {/* TV Shows Grid */}
      <section className="py-10 container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-hoverBg rounded-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.results && data.results.length > 0 ? (
          <>
            <ContentGrid 
              items={data.results} 
              type="tv" 
            />
            
            {/* Pagination */}
            <div className="flex justify-center items-center mt-10 space-x-2">
              <Button
                variant="outline"
                className="border-hoverBg text-white hover:bg-hoverBg"
                onClick={() => handlePageChange(filters.page ? filters.page - 1 : 1)}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-textSecondary mx-4">
                Page {filters.page} of {data.total_pages}
              </span>
              <Button
                variant="outline"
                className="border-hoverBg text-white hover:bg-hoverBg"
                onClick={() => handlePageChange(filters.page ? filters.page + 1 : 2)}
                disabled={filters.page === data.total_pages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-white mb-2">No TV shows found</h3>
            <p className="text-textSecondary">Try changing your filters or search terms</p>
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
};

export default TvShowsPage;

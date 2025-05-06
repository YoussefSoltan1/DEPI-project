import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { searchContent } from "../lib/api";
import { Movie, TVShow } from "@shared/types";
import MovieCard from "../components/movie-card";
import Navbar from "../components/navbar";

type SearchResult = {
  results: Array<Movie | TVShow>;
};

const isMovie = (item: Movie | TVShow): item is Movie => {
  return (item as Movie).title !== undefined;
};

const SearchPage = () => {
  // Extract query parameter from URL using window.location.search
  const queryParams = new URLSearchParams(window.location.search);
  const query = queryParams.get('q') || '';

  const { data, isLoading, error } = useQuery<SearchResult>({
    queryKey: ['search', query],
    queryFn: () => {
      if (!query) return Promise.resolve({ results: [] });
      return searchContent(query);
    },
    enabled: !!query,
  });

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        {!query && <p>No search query provided.</p>}
        {isLoading && <p>Loading...</p>}
        {error && <p>Error occurred while searching.</p>}
        {data && data.results && data.results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.results.map((item) => (
              <MovieCard 
                key={item.id} 
                item={item} 
                type={isMovie(item) ? 'movie' : 'tv'} 
              />
            ))}
          </div>
        ) : (
          query && <p>No results found for "{query}".</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

import { Movie } from "@shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Info, Play, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "@/lib/api";
import { Link } from "wouter";

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection = ({ movie }: HeroSectionProps) => {
  // Function to get image URL
  const getImageUrl = (path: string | null, size = "original") => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  // Get genre data
  const { data: genresData } = useQuery({
    queryKey: ["/api/genres/movie"],
    queryFn: () => getGenres("movie"),
  });

  // Find genre names based on IDs
  const getGenreNames = () => {
    if (!genresData?.genres || !movie.genre_ids) return [];

    return movie.genre_ids
      .map((id) => genresData.genres.find((genre) => genre.id === id))
      .filter(Boolean)
      .map((genre) => genre?.name)
      .slice(0, 3); // Limit to 3 genres
  };

  // Get year from release date
  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const genreNames = getGenreNames();

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      {movie.backdrop_path ? (
        <img
          src={getImageUrl(movie.backdrop_path)}
          alt={movie.title}
          className="absolute w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-hoverBg"></div>
      )}

      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-secondary text-white rounded-circle text-sm font-medium mb-4">
            New Release
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {movie.title}
          </h1>

          <div className="flex items-center text-sm mb-4 text-textSecondary flex-wrap gap-y-2">
            <span className="mr-3">{getYear(movie.release_date)}</span>
            <span className="mr-3 flex items-center">
              <Star className="text-yellow-500 mr-1 h-4 w-4" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </span>
          </div>

          <p className="text-white/80 mb-6 text-base md:text-lg line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {genreNames.map((name, index) => (
              <span
                key={index}
                className="bg-hoverBg px-3 py-1 rounded-circle text-sm text-white"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-secondary hover:bg-red-700 transition-colors duration-200 text-white py-3 px-6 rounded-circle flex items-center">
              <Play className="h-4 w-4 mr-2" /> Watch Now
            </Button>
            <Link href={`/movie/${movie.id}`}>
              <Button className="bg-hoverBg hover:bg-gray-700 transition-colors duration-200 text-white py-3 px-6 rounded-circle flex items-center">
                <Info className="h-4 w-4 mr-2" /> More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

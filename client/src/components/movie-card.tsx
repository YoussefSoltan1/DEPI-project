import { Movie, TVShow, ContentType } from "@shared/types";
import { Link } from "wouter";
import { Play, Plus } from "lucide-react";

interface MovieCardProps {
  item: Movie | TVShow;
  type: ContentType;
}

const MovieCard = ({ item, type }: MovieCardProps) => {
  // Function to get image URL
  const getImageUrl = (path: string | null, size = "w500") => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  // Function to get title based on type
  const getTitle = () => {
    if (type === "movie") {
      return (item as Movie).title;
    } else {
      return (item as TVShow).name;
    }
  };

  // Function to get year based on type
  const getYear = () => {
    if (type === "movie") {
      return new Date((item as Movie).release_date).getFullYear();
    } else {
      return new Date((item as TVShow).first_air_date).getFullYear();
    }
  };

  // Get URL link based on type
  const getLink = () => {
    return type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
  };

  // Function to calculate background color for rating based on score
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "bg-green-600";
    if (rating >= 6) return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <Link href={getLink()}>
      <div className="movie-card bg-hoverBg rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="relative">
          {item.poster_path ? (
            <img
              src={getImageUrl(item.poster_path)}
              alt={getTitle()}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-64 bg-hoverBg flex items-center justify-center">
              <span className="text-textSecondary">No image</span>
            </div>
          )}

          {typeof item.vote_average === "number" && (
            <div className="movie-rating text-sm absolute top-2 right-2 bg-black/70 text-white w-10 h-10 rounded-circle flex items-center justify-center font-bold">
              {item.vote_average.toFixed(1)}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="flex items-center gap-2 mb-2">
              <button className="bg-white/20 hover:bg-white/30 p-1.5 rounded-circle">
                <Play className="h-3 w-3 text-white" />
              </button>
              <button className="bg-white/20 hover:bg-white/30 p-1.5 rounded-circle">
                <Plus className="h-3 w-3 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-white truncate">{getTitle()}</h3>
          <div className="flex items-center text-textSecondary text-xs">
            <span>{getYear()}</span>
            {type === "movie" ? (
              <>
                <span className="mx-1">•</span>
                <span>Movie</span>
              </>
            ) : (
              <>
                <span className="mx-1">•</span>
                <span>TV</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

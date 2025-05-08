import { useEffect, useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MovieDetails } from "@shared/types";
import { getMovieDetails } from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import TrailerModal from "@/components/ui/trailer-modal";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

axios.defaults.withCredentials = true;
const MovieDetailPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/movie/:id");
  const [showTrailer, setShowTrailer] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery<MovieDetails>({
    queryKey: [`/api/movies/${params?.id}`],
    queryFn: () => getMovieDetails(params?.id || ""),
    enabled: !!params?.id,
  });

  const trailer = movie?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

  useEffect(() => {
    if (error) {
      setLocation("/not-found");
    }
  }, [error, setLocation]);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getImageUrl = (path: string | null, size = "original") => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/user");
      return res.data;
    },
    retry: false,
  });

  const { data: wishlist = [], isLoading: loadingWishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => axios.get("/api/wishlist", { withCredentials: true }).then(r => r.data),
    enabled: !!user,
  });
  
  
  

  const isWishlisted = useMemo(
    () => !!movie && wishlist.some((item: any) => item.movieId === movie.id),
    [movie, wishlist]
  );
  

  const addToWishlist = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/wishlist", { movieId: movie?.id });
      console.log("🎯 Wishlist response", res.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
      toast({ title: "❤️ Added to wishlist" });
      setWishlistIds((prev) => [...prev, movie!.id]);
    },
    onError: () => toast({ title: "⚠️ Couldn't add to wishlist" }),
  });

  const removeFromWishlist = useMutation({
    mutationFn: () => axios.delete(`/api/wishlist/${movie?.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
      toast({ title: "💔 Removed from wishlist" });
      setWishlistIds((prev) => prev.filter((id) => id !== movie!.id));
    },
    onError: () => toast({ title: "⚠️ Couldn't remove from wishlist" }),
  });

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="h-[450px] w-[300px] rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20 rounded-circle" />
                <Skeleton className="h-8 w-20 rounded-circle" />
                <Skeleton className="h-8 w-20 rounded-circle" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      {/* Movie Backdrop */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        {movie.backdrop_path ? (
          <img
            src={getImageUrl(movie.backdrop_path)}
            alt={movie.title}
            className="absolute w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-hoverBg"></div>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-[29rem] relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            {movie.poster_path ? (
              <img
                src={getImageUrl(movie.poster_path, "w342")}
                alt={movie.title}
                className="rounded-lg shadow-xl h-[450px] w-[300px] object-cover"
              />
            ) : (
              <div className="bg-hoverBg rounded-lg h-[450px] w-[300px] flex items-center justify-center">
                <span className="text-textSecondary">No poster available</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {movie.title} <span className="text-textSecondary">({getYear(movie.release_date)})</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-textSecondary mb-6">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{movie.vote_average.toFixed(1)} ({movie.vote_count} votes)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <Badge key={genre.id} variant="secondary" className="bg-hoverBg hover:bg-secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
              <p className="text-textSecondary leading-relaxed">{movie.overview}</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              {trailerUrl && (
                <Button
                  className="bg-secondary hover:bg-red-700"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶️ Watch Now
                </Button>
              )}
              <Button
                variant="outline"
                className="border-hoverBg text-white hover:bg-hoverBg"
                onClick={() =>
                  isWishlisted ? removeFromWishlist.mutate() : addToWishlist.mutate()
                }
                disabled={!user}
              >
                {isWishlisted ? "💔 Remove from Wishlist" : "❤️ Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>

        {showTrailer && trailerUrl && (
          <TrailerModal trailerUrl={trailerUrl} onClose={() => setShowTrailer(false)} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailPage;

import { useEffect, useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TVShowDetails } from "@shared/types";
import { getTVShowDetails } from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Tv2, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import TrailerModal from "@/components/ui/trailer-modal";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const TvDetailPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/tv/:id");
  const [showTrailer, setShowTrailer] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    data: tvShow,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/tv/${params?.id}`],
    queryFn: () => getTVShowDetails(params?.id || ""),
    enabled: !!params?.id,
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await axios.get("/api/wishlist");
      return res.data;
    },
    enabled: !!user,
  });

  const isWishlisted = useMemo(() => {
    return tvShow && wishlist.some((item: any) => item.movieId === tvShow.id);
  }, [wishlist, tvShow]);

  const addToWishlist = useMutation({
    mutationFn: () => axios.post("/api/wishlist", { movieId: tvShow!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
      toast({ title: "❤️ Added to wishlist" });
    },
    onError: () => toast({ title: "⚠️ Failed to add to wishlist" }),
  });

  const removeFromWishlist = useMutation({
    mutationFn: () => axios.delete(`/api/wishlist/${tvShow!.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
      toast({ title: "💔 Removed from wishlist" });
    },
    onError: () => toast({ title: "⚠️ Failed to remove from wishlist" }),
  });

  useEffect(() => {
    if (error) {
      setLocation("/not-found");
    }
  }, [error, setLocation]);

  const getYear = (dateString: string) => new Date(dateString).getFullYear();

  const getImageUrl = (path: string | null, size = "original") => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const trailer = tvShow?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

  if (isLoading || !tvShow) {
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

      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        {tvShow.backdrop_path ? (
          <img
            src={getImageUrl(tvShow.backdrop_path)}
            alt={tvShow.name}
            className="absolute w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-hoverBg"></div>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-40 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            {tvShow.poster_path ? (
              <img
                src={getImageUrl(tvShow.poster_path, "w342")}
                alt={tvShow.name}
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
              {tvShow.name}{" "}
              <span className="text-textSecondary">
                ({getYear(tvShow.first_air_date)})
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-textSecondary mb-6">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{new Date(tvShow.first_air_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Tv2 className="h-4 w-4 mr-1" />
                <span>{tvShow.number_of_seasons} Seasons, {tvShow.number_of_episodes} Episodes</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{tvShow.vote_average.toFixed(1)} ({tvShow.vote_count} votes)</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-0.5 bg-hoverBg rounded text-xs">{tvShow.status}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {tvShow.genres?.map((genre) => (
                <Badge key={genre.id} variant="secondary" className="bg-hoverBg hover:bg-secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
              <p className="text-textSecondary leading-relaxed">{tvShow.overview}</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              {trailerUrl && (
                <Button className="bg-secondary hover:bg-red-700" onClick={() => setShowTrailer(true)}>
                  ▶️ Watch Now
                </Button>
              )}
              <Button
                variant="outline"
                className="border-hoverBg text-white hover:bg-hoverBg"
                disabled={!user}
                onClick={() =>
                  isWishlisted
                    ? removeFromWishlist.mutate()
                    : addToWishlist.mutate()
                }
              >
                {isWishlisted ? "💔 Remove from Wishlist" : "❤️ Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showTrailer && trailerUrl && (
        <TrailerModal trailerUrl={trailerUrl} onClose={() => setShowTrailer(false)} />
      )}

      <Footer />
    </div>
  );
};

export default TvDetailPage;

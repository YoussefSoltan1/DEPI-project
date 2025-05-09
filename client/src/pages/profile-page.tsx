import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MovieCard from "@/components/movie-card";
import { Movie } from "@shared/types";

async function fetchInBatches(items: { movieId: number }[], batchSize = 5): Promise<Movie[]> {
  const results: Movie[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item) =>
        axios.get(`/api/movies/${item.movieId}`).then((res) => res.data as Movie)
      )
    );
    results.push(...batchResults);
  }

  return results;
}

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/auth"),
    });
  };

  const { data: wishlistMovies = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const wishlistRes = await axios.get("/api/wishlist");
      const items = wishlistRes.data;
      return fetchInBatches(items);
    },
  });

  const recentIds = useMemo(
    () => wishlistMovies.slice(-5).map((m) => m.id).reverse(),
    [wishlistMovies]
  );

  const { data: recommended = [], isLoading: loadingRecommended } = useQuery({
    queryKey: ["recommended", recentIds],
    enabled: recentIds.length > 0,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const results: Movie[] = [];

      for (const id of recentIds) {
        const res = await axios.get(`/api/movies/${id}/similar`);
        results.push(...res.data.results);
      }

      const unique = Array.from(new Map(results.map((m) => [m.id, m])).values());
      const filtered = unique.filter((m) => !wishlistMovies.find((w) => w.id === m.id));
      return filtered.slice(0, 12);
    },
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-primary text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Profile card */}
        <div className="bg-hoverBg rounded-xl p-6 max-w-md mx-auto shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">👤 Profile</h1>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-textSecondary font-medium">Username:</span> {user.username}
            </p>
            <p>
              <span className="text-textSecondary font-medium">Email:</span> {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-secondary hover:bg-red-700 text-white py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Wishlist section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">🎬 Wishlisted</h2>
          {isLoading ? (
            <p className="text-textSecondary">Loading wishlist…</p>
          ) : wishlistMovies.length === 0 ? (
            <p className="text-textSecondary">No movies in wishlist yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {wishlistMovies.map((movie) => (
                <MovieCard key={movie.id} item={movie} type="movie" />
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">🎯 Recommended for You</h2>
          {wishlistMovies.length === 0 ? (
            <p className="text-textSecondary">Add movies to your wishlist to see recommendations!</p>
          ) : loadingRecommended ? (
            <p className="text-textSecondary">Loading recommendations…</p>
          ) : recommended.length === 0 ? (
            <p className="text-textSecondary">No similar movies found yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recommended.map((movie) => (
                <MovieCard key={movie.id} item={movie} type="movie" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

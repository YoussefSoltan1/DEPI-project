import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MovieCard from "@/components/movie-card";
import Footer from "@/components/footer";

async function getMediaDetails(id: number) {
  try {
    const res = await axios.get(`/api/movies/${id}`);
    return { ...res.data, _type: "movie" };
  } catch (e: any) {
    if (e.response?.status === 404) {
      const res = await axios.get(`/api/tv/${id}`);
      return { ...res.data, _type: "tv" };
    }
    throw e;
  }
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

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await axios.get("/api/wishlist");
      const items = res.data;
      return Promise.all(items.map((item) => getMediaDetails(item.movieId)));
    },
  });

  const recentIds = useMemo(
    () => wishlistItems.slice(-5).map((m) => m.id).reverse(),
    [wishlistItems]
  );

  const { data: recommended = [], isLoading: loadingRecommended } = useQuery({
    queryKey: ["recommended", recentIds],
    enabled: recentIds.length > 0,
    queryFn: async () => {
      const results = [];
      for (const id of recentIds) {
        try {
          const res = await axios.get(`/api/movies/${id}/similar`);
          results.push(...res.data.results);
        } catch (e) {
          // ignore if it fails
        }
      }
      const seen = new Set();
      return results.filter((m) => {
        const ok = !seen.has(m.id);
        seen.add(m.id);
        return ok;
      });
    },
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-primary text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="bg-hoverBg rounded-xl p-6 max-w-md mx-auto shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">👤 Profile</h1>
          <div className="space-y-2 text-sm">
            <p><span className="text-textSecondary font-medium">Username:</span> {user.username}</p>
            <p><span className="text-textSecondary font-medium">Email:</span> {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-secondary hover:bg-red-700 text-white py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">🎬 Wishlisted</h2>
          {isLoading ? (
            <p className="text-textSecondary">Loading wishlist…</p>
          ) : wishlistItems.length === 0 ? (
            <p className="text-textSecondary">No movies or TV shows in wishlist yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {wishlistItems.map((item) => (
                <MovieCard key={item.id} item={item} type={item._type} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">🎯 Recommended for You</h2>
          {wishlistItems.length === 0 ? (
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
      <Footer />
    </div>
  );
}

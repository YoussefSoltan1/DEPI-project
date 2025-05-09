import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MovieCard from "@/components/movie-card";
import { Movie } from "@shared/types";

export default function RecommendedSection({ wishlist }: { wishlist: { movieId: number }[] }) {
  const recentIds = [...wishlist].reverse().slice(0, 5).map((m) => m.movieId);

  const { data: recommended = [], isLoading } = useQuery({
    queryKey: ["recommended", recentIds],
    enabled: recentIds.length > 0,
    queryFn: async () => {
      const results: Record<number, Movie[]> = {};

      for (const id of recentIds) {
        const res = await axios.get(`/api/movies/${id}/similar`);
        results[id] = res.data.results;
      }

      // flatten + filter duplicates + exclude existing wishlist IDs
      const all = Object.values(results).flat();
      const unique = Array.from(new Map(all.map((m) => [m.id, m])).values());
      const filtered = unique.filter((m) => !wishlist.find((w) => w.movieId === m.id));

      return filtered.slice(0, 12); // limit to 12
    },
    staleTime: 1000 * 60 * 10,
  });

  if (wishlist.length === 0) {
    return (
      <div className="mt-12 text-textSecondary">
        Add some movies to your wishlist to get recommendations!
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">🎯 Recommended for You</h2>
      {isLoading ? (
        <p className="text-textSecondary">Loading recommendations…</p>
      ) : recommended.length === 0 ? (
        <p className="text-textSecondary">No similar movies found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recommended.map((movie) => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      )}
    </div>
  );
}

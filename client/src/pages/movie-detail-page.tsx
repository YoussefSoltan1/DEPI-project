import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MovieDetails } from "@shared/types";
import { getMovieDetails } from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const MovieDetailPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/movie/:id");

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/movies/${params?.id}`],
    queryFn: () => getMovieDetails(params?.id || ""),
    enabled: !!params?.id,
  });

  useEffect(() => {
    if (error) {
      setLocation("/not-found");
    }
  }, [error, setLocation]);

  // Function to format runtime
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Calculate year from release date
  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  // Function to get image URL
  const getImageUrl = (path: string | null, size = "original") => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  if (isLoading) {
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

  if (!movie) {
    return null;
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

      {/* Movie Details */}
      <div className="container mx-auto px-4 -mt-[29rem] relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
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

          {/* Movie Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {movie.title}{" "}
              <span className="text-textSecondary">
                ({getYear(movie.release_date)})
              </span>
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
                <span>
                  {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                </span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-0.5 bg-hoverBg rounded text-xs">
                  {movie.status}
                </span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="bg-hoverBg hover:bg-secondary"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">
                Overview
              </h3>
              <p className="text-textSecondary leading-relaxed">
                {movie.overview}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button className="bg-secondary hover:bg-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Watch Now
              </Button>
              <Button
                variant="outline"
                className="border-hoverBg text-white hover:bg-hoverBg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs for Cast, Crew, etc. */}
        <div className="mt-12 mb-16">
          <Tabs defaultValue="cast">
            <TabsList className="bg-hoverBg">
              <TabsTrigger value="cast">Cast</TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="cast" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movie.credits?.cast?.slice(0, 12).map((person) => (
                  <Card
                    key={person.id}
                    className="bg-hoverBg border-none overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="relative pb-4">
                        <Avatar className="h-40 w-full rounded-circle">
                          {person.profile_path ? (
                            <AvatarImage
                              src={getImageUrl(person.profile_path, "w185")}
                            />
                          ) : null}
                          <AvatarFallback className="rounded-circle h-40 text-lg">
                            <User className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="p-3">
                          <h4 className="font-medium text-white truncate">
                            {person.name}
                          </h4>
                          <p className="text-xs text-textSecondary truncate">
                            {person.character}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="crew" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movie.credits?.crew?.slice(0, 12).map((person) => (
                  <Card
                    key={person.id}
                    className="bg-hoverBg border-none overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="relative pb-4">
                        <Avatar className="h-40 w-full rounded-circle">
                          {person.profile_path ? (
                            <AvatarImage
                              src={getImageUrl(person.profile_path, "w185")}
                            />
                          ) : null}
                          <AvatarFallback className="rounded-circle h-40 text-lg">
                            <User className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="p-3">
                          <h4 className="font-medium text-white truncate">
                            {person.name}
                          </h4>
                          <p className="text-xs text-textSecondary truncate">
                            {person.job}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Movie Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-textSecondary">Status: </span>
                      <span className="text-white">{movie.status}</span>
                    </div>
                    <div>
                      <span className="text-textSecondary">Release Date: </span>
                      <span className="text-white">
                        {new Date(movie.release_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-textSecondary">Runtime: </span>
                      <span className="text-white">
                        {formatRuntime(movie.runtime)}
                      </span>
                    </div>
                    {movie.budget ? (
                      <div>
                        <span className="text-textSecondary">Budget: </span>
                        <span className="text-white">
                          ${movie.budget.toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                    {movie.revenue ? (
                      <div>
                        <span className="text-textSecondary">Revenue: </span>
                        <span className="text-white">
                          ${movie.revenue.toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres?.map((genre) => (
                      <Badge
                        key={genre.id}
                        variant="secondary"
                        className="bg-hoverBg hover:bg-secondary"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailPage;

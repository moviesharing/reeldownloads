import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import Advertisement from "@/components/Advertisement";

const Index = () => {
  useEffect(() => {
    document.title = "MovieDownloads - Home";
  }, []);

  const { data: movies, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axios.get(
        "https://yts.mx/api/v2/list_movies.json?sort_by=download_count"
      );
      return response.data.data.movies;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Find Your Favorite Movies</h1>
        <p className="mb-8 text-gray-400">Search from thousands of movies to download</p>
        <div className="mx-auto max-w-2xl">
          <SearchBar />
        </div>
      </div>
      
      <Advertisement />
      
      <h2 className="mb-8 text-2xl font-bold">Popular Downloads</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {movies?.map((movie: any) => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative aspect-[2/3] overflow-hidden rounded-lg"
            >
              <img
                src={movie.medium_cover_image}
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-lg font-semibold">{movie.title}</h2>
                <p className="text-sm text-gray-300">
                  {movie.year} • {movie.rating}/10
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      <Advertisement />
    </div>
  );
};

export default Index;
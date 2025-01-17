import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import Advertisement from "@/components/Advertisement";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { GenreFilter } from "@/components/GenreFilter";
import { MovieGrid } from "@/components/MovieGrid";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  const { recentMovies } = useRecentlyViewed();
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    document.title = "ReelDownloads - Home";
  }, []);

  const { data: movies = [], isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axios.get(
        "https://yts.mx/api/v2/list_movies.json?sort_by=download_count&limit=50"
      );
      return response.data.data.movies || [];
    },
  });

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error loading movies. Please try again later.</p>
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
      
      {recentMovies.length > 0 && (
        <div className="mb-12">
          <RecentlyViewed movies={recentMovies} />
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Popular Downloads</h2>
        <GenreFilter selectedGenre={selectedGenre} onGenreChange={handleGenreChange} />
      </div>

      <MovieGrid 
        movies={movies} 
        isLoading={isLoading} 
        selectedGenre={selectedGenre}
      />
      
      <Advertisement />
      <BackToTop />
    </div>
  );
};

export default Index;
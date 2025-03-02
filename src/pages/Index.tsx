import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  medium_cover_image: string;
  genres: string[];
}

interface MovieResponse {
  movie_count: number;
  movies: Movie[];
}

const Index = () => {
  const { recentMovies } = useRecentlyViewed();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);

  useEffect(() => {
    document.title = "ReelDownloads - Home";
  }, []);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useInfiniteQuery({
      queryKey: ["movies", page],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axios.get<{ data: MovieResponse }>(
          `https://yts.mx/api/v2/list_movies.json?sort_by=download_count&limit=20&page=${pageParam}`
        );
        return response.data.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.movie_count > pages.length * 20) {
          return pages.length + 1;
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const allMovies = data?.pages?.flatMap((page) => page.movies) || [];

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
        movies={allMovies} 
        isLoading={isLoading} 
        selectedGenre={selectedGenre}
      />
      
      {!isLoading && (
        <div
          ref={loadMoreRef}
          className="mt-8 flex justify-center"
        >
          {isFetchingNextPage && (
            <div className="animate-pulse text-gray-400">Loading more movies...</div>
          )}
        </div>
      )}
      
      <Advertisement />
      <BackToTop />
    </div>
  );
};

export default Index;
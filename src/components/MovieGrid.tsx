import { MovieCard } from "./MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  medium_cover_image: string;
  genres: string[];
}

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  selectedGenre: string;
}

export const MovieGrid = ({ movies = [], isLoading, selectedGenre }: MovieGridProps) => {
  if (!movies) {
    return null;
  }

  const filteredMovies = selectedGenre === "All" 
    ? movies 
    : movies.filter((movie) => movie.genres?.includes(selectedGenre));

  if (isLoading && movies.length === 0) {
    return (
      <div className="movie-grid">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="relative aspect-[2/3]"
          >
            <Skeleton className="h-full w-full rounded-lg">
              <div className="absolute inset-0 loading-shimmer" />
            </Skeleton>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="movie-grid"
    >
      <AnimatePresence mode="wait">
        {filteredMovies.map((movie) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <MovieCard
              id={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              poster={movie.medium_cover_image}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
import { MovieCard } from "./MovieCard";
import { motion } from "framer-motion";

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  medium_cover_image: string;
}

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
}

export const MovieGrid = ({ movies, isLoading }: MovieGridProps) => {
  if (isLoading) {
    return (
      <div className="movie-grid">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-gray-800 aspect-[2/3]"
          />
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
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          year={movie.year}
          rating={movie.rating}
          poster={movie.medium_cover_image}
        />
      ))}
    </motion.div>
  );
};
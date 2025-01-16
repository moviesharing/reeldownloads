import { motion } from "framer-motion";
import { MovieCard } from "./MovieCard";
import type { RecentMovie } from "@/hooks/useRecentlyViewed";

interface RecentlyViewedProps {
  movies: RecentMovie[];
}

export const RecentlyViewed = ({ movies }: RecentlyViewedProps) => {
  if (!movies.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h2 className="mb-6 text-2xl font-bold">Recently Viewed</h2>
      <div className="movie-grid">
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
      </div>
    </motion.div>
  );
};
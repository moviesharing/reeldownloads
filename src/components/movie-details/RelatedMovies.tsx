import { motion } from "framer-motion";
import { MovieCard } from "../MovieCard";

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  medium_cover_image: string;
}

interface RelatedMoviesProps {
  movies: Movie[];
}

const RelatedMovies = ({ movies }: RelatedMoviesProps) => {
  if (!movies || movies.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="mt-12"
    >
      <h2 className="mb-6 text-2xl font-semibold">You might also like</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.slice(0, 5).map((movie) => (
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

export default RelatedMovies;
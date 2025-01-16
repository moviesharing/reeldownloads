import { motion } from "framer-motion";
import FavoriteButton from "./FavoriteButton";

interface MovieInfoProps {
  title: string;
  genres: string[];
  description: string;
  year: number;
  rating: number;
  runtime: number;
  id: number;
  medium_cover_image: string;
}

const MovieInfo = ({ 
  title, 
  genres, 
  description, 
  year, 
  rating, 
  runtime,
  id,
  medium_cover_image 
}: MovieInfoProps) => {
  return (
    <>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4 text-4xl font-bold"
      >
        {title}
      </motion.h1>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-4 flex flex-wrap gap-2"
      >
        {genres?.map((genre: string) => (
          <span
            key={genre}
            className="rounded-full bg-white/10 px-3 py-1 text-sm"
          >
            {genre}
          </span>
        ))}
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-4"
      >
        <FavoriteButton
          movie={{
            id,
            title,
            year,
            rating,
            medium_cover_image,
          }}
        />
      </motion.div>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-4 text-lg"
      >
        {description}
      </motion.p>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-4"
      >
        <p>Year: {year}</p>
        <p>Rating: {rating}/10</p>
        <p>Runtime: {runtime} minutes</p>
      </motion.div>
    </>
  );
};

export default MovieInfo;
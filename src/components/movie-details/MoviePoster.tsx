import { motion } from "framer-motion";

interface MoviePosterProps {
  image: string;
  title: string;
}

const MoviePoster = ({ image, title }: MoviePosterProps) => {
  return (
    <motion.img
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      src={image}
      alt={title}
      className="h-[450px] w-full rounded-lg object-cover"
    />
  );
};

export default MoviePoster;
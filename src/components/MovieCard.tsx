import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
}

export const MovieCard = ({ id, title, year, rating, poster }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const placeholderImage = "/placeholder.svg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="movie-card"
    >
      <Link to={`/movie/${id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          {!imageLoaded && (
            <div className="absolute inset-0">
              <Skeleton className="h-full w-full">
                <div className="absolute inset-0 loading-shimmer" />
              </Skeleton>
            </div>
          )}
          <motion.img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = placeholderImage;
              setImageLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 w-full p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-white/10 px-2 py-1 text-xs font-medium">
                  {year}
                </span>
                <span className="rounded bg-white/10 px-2 py-1 text-xs font-medium">
                  {rating}/10
                </span>
              </div>
              <h2 className="line-clamp-2 text-lg font-semibold text-white">
                {title}
              </h2>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
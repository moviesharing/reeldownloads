import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect } from "react";
import Advertisement from "@/components/Advertisement";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const MovieDetails = () => {
  const { id } = useParams();
  const { addMovie } = useRecentlyViewed();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const response = await axios.get(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`
      );
      return response.data.data.movie;
    },
  });

  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} - ReelDownloads`;
      addMovie({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        rating: movie.rating,
        medium_cover_image: movie.medium_cover_image,
      });
    }
  }, [movie, addMovie]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Advertisement />
        <div className="mb-8 grid gap-8 md:grid-cols-[300px,1fr]">
          <Skeleton className="h-[450px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Advertisement />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Advertisement />
      <div className="mb-8 grid gap-8 md:grid-cols-[300px,1fr]">
        <motion.img
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          src={movie.large_cover_image}
          alt={movie.title}
          className="h-[450px] w-full rounded-lg object-cover"
        />
        <div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 text-4xl font-bold"
          >
            {movie.title}
          </motion.h1>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 flex flex-wrap gap-2"
          >
            {movie.genres?.map((genre: string) => (
              <span
                key={genre}
                className="rounded-full bg-white/10 px-3 py-1 text-sm"
              >
                {genre}
              </span>
            ))}
          </motion.div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-4 text-lg"
          >
            {movie.description_full}
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4"
          >
            <p>Year: {movie.year}</p>
            <p>Rating: {movie.rating}/10</p>
            <p>Runtime: {movie.runtime} minutes</p>
          </motion.div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">Downloads</h2>
            {movie.torrents?.map((torrent: any, index: number) => (
              <motion.div
                key={torrent.url}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Button
                  className="flex w-full items-center justify-between gap-4 bg-gray-800"
                  variant="secondary"
                  asChild
                >
                  <a href={torrent.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span className="text-white">
                        {torrent.quality} • {torrent.size}
                      </span>
                    </div>
                    <span className="text-white">{torrent.type}</span>
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <Advertisement />
    </motion.div>
  );
};

export default MovieDetails;
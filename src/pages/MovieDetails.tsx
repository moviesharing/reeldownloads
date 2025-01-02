import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import axios from "axios";

const MovieDetails = () => {
  const { id } = useParams();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const response = await axios.get(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
      );
      return response.data.data.movie;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img
            src={movie.background_image_original}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-[300px,1fr]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[2/3] overflow-hidden rounded-lg"
              >
                <img
                  src={movie.large_cover_image}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {movie.genres?.map((genre: string) => (
                      <span
                        key={genre}
                        className="rounded bg-white/10 px-2 py-1 text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-4xl font-bold">{movie.title}</h1>
                  <p className="text-xl text-gray-400">
                    {movie.year} • {movie.rating}/10
                  </p>
                </div>
                <p className="text-lg text-gray-300">{movie.description_full}</p>
                <div className="space-y-4 pt-4">
                  <h2 className="text-xl font-semibold">Downloads</h2>
                  <div className="flex flex-wrap gap-4">
                    {movie.torrents?.map((torrent: any) => (
                      <Button
                        key={torrent.url}
                        className="bg-white/10 hover:bg-white/20"
                        asChild
                      >
                        <a href={torrent.url} download>
                          {torrent.quality} • {torrent.size}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetails;
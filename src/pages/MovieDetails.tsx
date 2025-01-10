import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect } from "react";
import Advertisement from "@/components/Advertisement";

const MovieDetails = () => {
  const { id } = useParams();

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
      document.title = `${movie.title} - MovieDownloads`;
    }
  }, [movie]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Advertisement />
      <div className="mb-8 grid gap-8 md:grid-cols-[300px,1fr]">
        <img
          src={movie.large_cover_image}
          alt={movie.title}
          className="h-[450px] w-full rounded-lg object-cover"
        />
        <div>
          <h1 className="mb-4 text-4xl font-bold">{movie.title}</h1>
          <div className="mb-4 flex flex-wrap gap-2">
            {movie.genres?.map((genre: string) => (
              <span
                key={genre}
                className="rounded-full bg-white/10 px-3 py-1 text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
          <p className="mb-4 text-lg">{movie.description_full}</p>
          <div className="mb-4">
            <p>Year: {movie.year}</p>
            <p>Rating: {movie.rating}/10</p>
            <p>Runtime: {movie.runtime} minutes</p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Downloads</h2>
            {movie.torrents?.map((torrent: any) => (
              <Button
                key={torrent.url}
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
            ))}
          </div>
        </div>
      </div>
      <Advertisement />
    </div>
  );
};

export default MovieDetails;
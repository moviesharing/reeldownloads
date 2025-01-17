import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Advertisement from "@/components/Advertisement";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import MoviePoster from "@/components/movie-details/MoviePoster";
import MovieInfo from "@/components/movie-details/MovieInfo";
import DownloadSection from "@/components/movie-details/DownloadSection";
import LoadingSkeleton from "@/components/movie-details/LoadingSkeleton";
import Reviews from "@/components/movie-details/Reviews";
import RelatedMovies from "@/components/movie-details/RelatedMovies";

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

  const { data: suggestedMovies } = useQuery({
    queryKey: ["suggested-movies", id],
    queryFn: async () => {
      const response = await axios.get(
        `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${id}`
      );
      return response.data.data.movies;
    },
    enabled: !!movie,
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
        <LoadingSkeleton />
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
        <MoviePoster 
          image={movie.large_cover_image} 
          title={movie.title} 
        />
        <div>
          <MovieInfo 
            id={movie.id}
            title={movie.title}
            genres={movie.genres}
            description={movie.description_full}
            year={movie.year}
            rating={movie.rating}
            runtime={movie.runtime}
            medium_cover_image={movie.medium_cover_image}
            yt_trailer_code={movie.yt_trailer_code}
            cast={movie.cast}
          />
          <DownloadSection torrents={movie.torrents} />
        </div>
      </div>
      <Reviews movieId={movie.id} />
      <RelatedMovies movies={suggestedMovies || []} />
      <Advertisement />
    </motion.div>
  );
};

export default MovieDetails;
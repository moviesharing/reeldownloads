import { motion } from "framer-motion";
import FavoriteButton from "./FavoriteButton";

interface CastMember {
  name: string;
  character_name?: string;
  url_small_image?: string;
}

interface MovieInfoProps {
  title: string;
  genres: string[];
  description: string;
  year: number;
  rating: number;
  runtime: number;
  id: number;
  medium_cover_image: string;
  yt_trailer_code?: string;
  cast?: CastMember[];
}

const MovieInfo = ({ 
  title, 
  genres, 
  description, 
  year, 
  rating, 
  runtime,
  id,
  medium_cover_image,
  yt_trailer_code,
  cast
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
      {yt_trailer_code && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 aspect-video w-full overflow-hidden rounded-lg"
        >
          <iframe
            src={`https://www.youtube.com/embed/${yt_trailer_code}`}
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </motion.div>
      )}
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
      {cast && cast.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="mb-4 text-2xl font-semibold">Cast</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {cast.map((member, index) => (
              <motion.div
                key={member.name + index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-2 h-32 w-32 overflow-hidden rounded-full">
                  {member.url_small_image ? (
                    <img
                      src={member.url_small_image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-700">
                      <span className="text-3xl">{member.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <p className="font-semibold">{member.name}</p>
                {member.character_name && (
                  <p className="text-sm text-gray-400">{member.character_name}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MovieInfo;
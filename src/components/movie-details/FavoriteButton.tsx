import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites, FavoriteMovie } from "@/hooks/useFavorites";
import { useToast } from "@/components/ui/use-toast";

interface FavoriteButtonProps {
  movie: FavoriteMovie;
}

const FavoriteButton = ({ movie }: FavoriteButtonProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const isMovieFavorite = isFavorite(movie.id);

  const handleFavoriteClick = () => {
    if (isMovieFavorite) {
      removeFavorite(movie.id);
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your favorites`,
      });
    } else {
      addFavorite(movie);
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites`,
      });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={handleFavoriteClick}
        variant={isMovieFavorite ? "destructive" : "secondary"}
        className="gap-2"
      >
        <Heart className={isMovieFavorite ? "fill-current" : ""} />
        {isMovieFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </Button>
    </motion.div>
  );
};

export default FavoriteButton;
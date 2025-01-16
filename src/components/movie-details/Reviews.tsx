import { motion } from "framer-motion";
import { useReviews } from "@/hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useToast } from "@/components/ui/use-toast";

interface ReviewsProps {
  movieId: number;
}

const Reviews = ({ movieId }: ReviewsProps) => {
  const { reviews, addReview } = useReviews(movieId);
  const { toast } = useToast();

  const handleSubmitReview = (reviewData: { rating: number; comment: string; author: string }) => {
    addReview({ movieId, ...reviewData });
    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <div className="space-y-8">
        <ReviewList reviews={reviews} />
        <div>
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <ReviewForm movieId={movieId} onSubmit={handleSubmitReview} />
        </div>
      </div>
    </motion.div>
  );
};

export default Reviews;
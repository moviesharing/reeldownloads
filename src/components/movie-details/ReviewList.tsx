import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Review } from "@/hooks/useReviews";

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground italic">No reviews yet. Be the first to review!</p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium">{review.author}</p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <time className="text-sm text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </time>
          </div>
          <p className="text-sm">{review.comment}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;
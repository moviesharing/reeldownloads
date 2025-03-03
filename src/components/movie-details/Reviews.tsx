
import { motion } from "framer-motion";
import { useReviews } from "@/hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ReviewsProps {
  movieId: number;
}

const Reviews = ({ movieId }: ReviewsProps) => {
  const { reviews, addReview, isLoading, error } = useReviews(movieId);
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSubmitReview = (reviewData: { rating: number; comment: string; author: string }) => {
    addReview({ movieId, ...reviewData });
    // Toast notification is handled inside the useReviews hook
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force a reload to fetch fresh data from Supabase
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : (
          <ReviewList reviews={reviews} />
        )}
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <ReviewForm movieId={movieId} onSubmit={handleSubmitReview} />
        </div>
      </div>
    </motion.div>
  );
};

export default Reviews;


import { motion } from "framer-motion";
import { useReviews } from "@/hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ReviewsProps {
  movieId: number;
}

const Reviews = ({ movieId }: ReviewsProps) => {
  const { reviews, addReview, isLoading, refetchReviews, isRefetching } = useReviews(movieId);
  const { toast } = useToast();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmitReview = (reviewData: { rating: number; comment: string; author: string }) => {
    addReview({ movieId, ...reviewData });
  };

  const handleRefresh = () => {
    if (isOffline) {
      toast({
        title: "You're offline",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return;
    }
    
    refetchReviews();
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
          disabled={isRefetching || isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-8">
        {isOffline && (
          <Alert variant="warning">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You're offline. Showing locally saved reviews.
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
          <>
            {reviews.length === 0 ? (
              <div className="p-4 border rounded-md bg-muted/30">
                <p className="text-center text-muted-foreground">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </>
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

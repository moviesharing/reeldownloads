
import { motion } from "framer-motion";
import { useReviews } from "@/hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ReviewsProps {
  movieId: number;
}

const Reviews = ({ movieId }: ReviewsProps) => {
  const { reviews, addReview, isLoading, error, refetchReviews, isRefetching } = useReviews(movieId);
  const { toast } = useToast();
  const [wasOffline, setWasOffline] = useState(false);

  // Check if we're online after being offline
  const checkOnlineStatus = () => {
    if (window.navigator.onLine && wasOffline) {
      setWasOffline(false);
      refetchReviews();
      toast({
        title: "You're back online",
        description: "Attempting to fetch the latest reviews.",
      });
    }
  };

  // Listen for online/offline events
  useState(() => {
    const handleOnline = () => {
      checkOnlineStatus();
    };

    const handleOffline = () => {
      setWasOffline(true);
      toast({
        title: "You're offline",
        description: "We'll show locally saved reviews until you're back online.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  const handleSubmitReview = (reviewData: { rating: number; comment: string; author: string }) => {
    if (!window.navigator.onLine) {
      toast({
        title: "You're offline",
        description: "Your review will be saved locally and uploaded when you're back online.",
        variant: "destructive",
      });
    }
    
    addReview({ movieId, ...reviewData });
  };

  const handleRefresh = () => {
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
          disabled={isRefetching}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-8">
        {!window.navigator.onLine && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>You're offline</AlertTitle>
            <AlertDescription>
              You're viewing locally saved reviews. Connect to the internet to see the latest reviews.
            </AlertDescription>
          </Alert>
        )}
        
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

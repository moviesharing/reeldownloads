
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Review {
  id: string;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  author: string;
}

export const useReviews = (movieId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isLocalData, setIsLocalData] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch reviews
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setIsLocalData(false);
    setConnectionError(null);
    
    try {
      console.log(`Fetching reviews for movie ID: ${movieId}`);
      
      // First, check if we're online
      if (!navigator.onLine) {
        setIsLocalData(true);
        setConnectionError("You're offline");
        throw new Error("You're offline. Showing locally stored reviews.");
      }
      
      // Fetch reviews from Supabase
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews from Supabase:', error);
        setIsLocalData(true);
        setConnectionError(`Database error: ${error.message}`);
        
        // Fallback to localStorage if Supabase fails
        const storedReviews = localStorage.getItem(`reviews-${movieId}`);
        if (storedReviews) {
          console.log('Falling back to localStorage reviews');
          setReviews(JSON.parse(storedReviews));
        }
      } else {
        console.log(`Received ${data?.length || 0} reviews from Supabase`);
        
        // Transform data to match our Review interface
        const formattedReviews = data.map(review => ({
          id: review.id,
          movieId: review.movie_id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at,
          author: review.author
        }));
        
        setReviews(formattedReviews);
        // Clear any previous error state
        setConnectionError(null);
        
        // Update localStorage as a backup
        localStorage.setItem(`reviews-${movieId}`, JSON.stringify(formattedReviews));
      }
    } catch (err) {
      console.error('Exception when fetching reviews:', err);
      setIsLocalData(true);
      
      // Set appropriate error message based on error type
      if (!navigator.onLine) {
        setConnectionError("You're offline");
      } else if (err instanceof Error) {
        if (err.message.includes("timeout")) {
          setConnectionError("Connection timeout");
        } else {
          setConnectionError(`Connection error: ${err.message}`);
        }
      } else {
        setConnectionError("Unknown connection error");
      }
      
      // Fallback to localStorage on exception
      const storedReviews = localStorage.getItem(`reviews-${movieId}`);
      if (storedReviews) {
        console.log('Falling back to localStorage reviews after exception');
        setReviews(JSON.parse(storedReviews));
      }
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [movieId]);

  // Fetch reviews when component mounts or movieId changes
  useEffect(() => {
    fetchReviews();
    
    // Set up event listeners for online/offline status
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        toast({
          title: "You're back online",
          description: "Fetching the latest reviews...",
        });
        fetchReviews();
      } else {
        toast({
          title: "You're offline",
          description: "Showing locally saved reviews until you're back online.",
          variant: "destructive",
        });
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [fetchReviews, toast]);

  // Function to refresh reviews on demand
  const refetchReviews = () => {
    setIsRefetching(true);
    fetchReviews();
  };

  // Function to add a new review
  const addReview = async (review: Omit<Review, "id" | "createdAt">) => {
    try {
      console.log('Saving review to Supabase:', review);
      
      // Check if we're online first
      if (!navigator.onLine) {
        setIsLocalData(true);
        setConnectionError("You're offline");
        
        toast({
          title: "You're offline",
          description: "Your review will be saved locally and submitted when you're back online.",
          variant: "destructive",
        });
        
        // Generate temporary ID for local storage
        const tempReview = {
          ...review,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        
        // Update local state for responsive UI
        setReviews(prevReviews => [tempReview, ...prevReviews]);
        
        // Save to local storage for offline persistence
        const updatedReviews = [tempReview, ...reviews];
        localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
        
        return tempReview;
      }
      
      // Online - submit to Supabase
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            movie_id: review.movieId,
            author: review.author,
            rating: review.rating,
            comment: review.comment
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding review to Supabase:', error);
        setConnectionError(`Database error: ${error.message}`);
        
        toast({
          title: "Error saving review",
          description: error.message,
          variant: "destructive",
        });
        
        // Return a temporary review object for the UI
        const tempReview = {
          ...review,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        
        return tempReview;
      }
      
      // Transform the data to match our Review interface
      const newReview = {
        id: data.id,
        movieId: data.movie_id,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.created_at,
        author: data.author
      };
      
      console.log('Review successfully saved to Supabase', newReview);
      
      // Update local state
      setReviews(prevReviews => [newReview, ...prevReviews]);
      setConnectionError(null);
      
      toast({
        title: "Review saved",
        description: "Your review has been successfully saved.",
      });
      
      // Update local storage as backup
      const updatedReviews = [newReview, ...reviews.filter(r => r.id !== newReview.id)];
      localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
      
      return newReview;
    } catch (err) {
      console.error('Exception when adding review:', err);
      
      toast({
        title: "Error saving review",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      });
      
      // Return a temporary review for the UI
      const tempReview = {
        ...review,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      
      return tempReview;
    }
  };

  return { 
    reviews, 
    addReview, 
    isLoading, 
    isLocalData,
    connectionError,
    refetchReviews, 
    isRefetching 
  };
};

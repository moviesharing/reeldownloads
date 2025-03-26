
import { useState, useEffect, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";

// Initialize Supabase client with environment variables
// Note: These are public keys intended for client-side use
const supabaseUrl = 'https://jtbkrrthgxfggkhsxmiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YmtycnRoZ3hmZ2draHN4bWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1NjMxMzMsImV4cCI6MjAzNDEzOTEzM30.kfzMZjTpBKbdrAFV_UNQfUlCEoXlQswEjUsMkXTf4hw';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface Review {
  id: string;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  author: string;
}

interface SupabaseResponse {
  data: Review[] | null;
  error: { message: string } | null;
}

export const useReviews = (movieId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isLocalData, setIsLocalData] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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
      
      // Add a timeout to handle network issues
      const timeoutPromise: Promise<SupabaseResponse> = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout after 10 seconds")), 10000)
      );
      
      // Create the Supabase fetch promise
      const fetchPromise = supabase
        .from('reviews')
        .select('*')
        .eq('movieId', movieId)
        .order('createdAt', { ascending: false });
      
      // Race between timeout and fetch
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Type guard to check if result is from Supabase
      if (result && 'data' in result && 'error' in result) {
        const { data, error } = result as SupabaseResponse;
        
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
          setReviews(data || []);
          // Clear any previous error state
          setConnectionError(null);
          setRetryCount(0);
          // Update localStorage as a backup
          localStorage.setItem(`reviews-${movieId}`, JSON.stringify(data || []));
        }
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
      } else {
        // No local storage data available
        console.log('No localStorage fallback available');
      }
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [movieId, toast]);

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

  // Auto-retry connection if failed (maximum 3 attempts)
  useEffect(() => {
    let retryTimer: number | undefined;
    
    if (connectionError && navigator.onLine && retryCount < 3) {
      retryTimer = window.setTimeout(() => {
        console.log(`Auto-retrying connection (attempt ${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        fetchReviews();
      }, 5000 * (retryCount + 1)); // Exponential backoff
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [connectionError, retryCount, fetchReviews]);

  // Function to refresh reviews on demand
  const refetchReviews = () => {
    setIsRefetching(true);
    setRetryCount(0); // Reset retry count on manual refresh
    fetchReviews();
  };

  // Function to add a new review
  const addReview = async (review: Omit<Review, "id" | "createdAt">) => {
    const newReview = {
      ...review,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    // First update the local state to make the UI feel responsive
    setReviews(prevReviews => [newReview, ...prevReviews]);
    
    try {
      console.log('Saving review to Supabase:', newReview);
      
      // Check if we're online first
      if (!navigator.onLine) {
        setIsLocalData(true);
        setConnectionError("You're offline");
        throw new Error("You're offline. Review saved locally only.");
      }
      
      // Add a timeout to handle network issues
      const timeoutPromise: Promise<{ error: { message: string } | null }> = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Submission timeout after 15 seconds")), 15000)
      );
      
      // Create the Supabase insert promise
      const insertPromise = supabase
        .from('reviews')
        .insert([newReview]);
      
      // Race between timeout and insert
      const result = await Promise.race([insertPromise, timeoutPromise]);
      
      // Type guard to check if result is from Supabase
      if (result && 'error' in result) {
        const { error } = result as { error: { message: string } | null };
        
        if (error) {
          console.error('Error adding review to Supabase:', error);
          setIsLocalData(true);
          setConnectionError(`Database error: ${error.message}`);
          
          toast({
            title: "Review saved locally only",
            description: "Couldn't connect to review server. Your review is saved on this device.",
            variant: "warning",
          });
        } else {
          console.log('Review successfully saved to Supabase');
          setConnectionError(null);
          toast({
            title: "Review saved",
            description: "Your review has been successfully saved.",
          });
        }
      }
      
      // Keep localStorage in sync (as backup)
      const updatedReviews = [newReview, ...reviews.filter(r => r.id !== newReview.id)];
      localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
    } catch (err) {
      console.error('Exception when adding review:', err);
      setIsLocalData(true);
      
      // Set appropriate error message based on error type
      if (!navigator.onLine) {
        setConnectionError("You're offline");
        toast({
          title: "You're offline",
          description: "Your review is saved locally and will be uploaded when you're back online.",
          variant: "destructive",
        });
      } else if (err instanceof Error) {
        setConnectionError(`Connection error: ${err.message}`);
        toast({
          title: "Connection issue",
          description: "Your review is saved locally but couldn't be uploaded to the server.",
          variant: "warning",
        });
      }
      
      // Ensure localStorage is updated even if Supabase operation fails
      const updatedReviews = [newReview, ...reviews.filter(r => r.id !== newReview.id)];
      localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
    }

    return newReview;
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

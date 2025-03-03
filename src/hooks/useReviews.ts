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

export const useReviews = (movieId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const { toast } = useToast();

  // Function to fetch reviews
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching reviews for movie ID: ${movieId}`);
      
      // Add a timeout to handle network issues
      const timeoutPromise = new Promise((_, reject) => 
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
      
      // If result is from Supabase (not the timeout), handle it
      if ('data' in result && 'error' in result) {
        const { data, error } = result;
        
        if (error) {
          console.error('Error fetching reviews from Supabase:', error);
          setError(`Database error: ${error.message}`);
          toast({
            title: "Error fetching reviews",
            description: error.message,
            variant: "destructive",
          });
          
          // Fallback to localStorage if Supabase fails
          const storedReviews = localStorage.getItem(`reviews-${movieId}`);
          if (storedReviews) {
            console.log('Falling back to localStorage reviews');
            setReviews(JSON.parse(storedReviews));
          }
        } else {
          console.log(`Received ${data?.length || 0} reviews from Supabase`);
          setReviews(data || []);
          // Update localStorage as a backup
          localStorage.setItem(`reviews-${movieId}`, JSON.stringify(data || []));
        }
      }
    } catch (err) {
      console.error('Exception when fetching reviews:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching reviews';
      setError(errorMessage);
      
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
  }, [fetchReviews]);

  // Function to refresh reviews on demand
  const refetchReviews = () => {
    setIsRefetching(true);
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
      
      // Add a timeout to handle network issues
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Submission timeout after 15 seconds")), 15000)
      );
      
      // Create the Supabase insert promise
      const insertPromise = supabase
        .from('reviews')
        .insert([newReview]);
      
      // Race between timeout and insert
      const result = await Promise.race([insertPromise, timeoutPromise]);
      
      // If result is from Supabase (not the timeout), handle it
      if ('error' in result) {
        const { error } = result;
        
        if (error) {
          console.error('Error adding review to Supabase:', error);
          setError(`Failed to save review: ${error.message}`);
          toast({
            title: "Error saving review",
            description: `Your review is saved locally, but couldn't be sent to our servers. Error: ${error.message}`,
            variant: "destructive",
          });
        } else {
          console.log('Review successfully saved to Supabase');
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
      const errorMessage = err instanceof Error ? err.message : 'Unknown error saving review';
      setError(errorMessage);
      toast({
        title: "Network error",
        description: "Your review is saved locally, but we couldn't connect to our servers. Please try again later.",
        variant: "destructive",
      });
      
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
    error, 
    refetchReviews, 
    isRefetching 
  };
};

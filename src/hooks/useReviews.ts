import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";

// Initialize Supabase client
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
  const { toast } = useToast();

  // Fetch reviews from Supabase when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching reviews for movie ID: ${movieId}`);
        
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('movieId', movieId)
          .order('createdAt', { ascending: false });

        if (error) {
          console.error('Error fetching reviews from Supabase:', error);
          setError(error.message);
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
      } catch (err) {
        console.error('Exception when fetching reviews:', err);
        setError(err instanceof Error ? err.message : 'Unknown error fetching reviews');
        
        // Fallback to localStorage on exception
        const storedReviews = localStorage.getItem(`reviews-${movieId}`);
        if (storedReviews) {
          console.log('Falling back to localStorage reviews after exception');
          setReviews(JSON.parse(storedReviews));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [movieId, toast]);

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
      
      // Insert into Supabase
      const { error } = await supabase
        .from('reviews')
        .insert([newReview]);

      if (error) {
        console.error('Error adding review to Supabase:', error);
        setError(error.message);
        toast({
          title: "Error saving review",
          description: error.message,
          variant: "destructive",
        });
        
        // Keep the review in localStorage even if Supabase fails
        const updatedReviews = [newReview, ...reviews.filter(r => r.id !== newReview.id)];
        localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
      } else {
        console.log('Review successfully saved to Supabase');
        toast({
          title: "Review saved",
          description: "Your review has been successfully saved.",
        });
        
        // Keep localStorage in sync (as backup)
        const updatedReviews = [newReview, ...reviews.filter(r => r.id !== newReview.id)];
        localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
      }
    } catch (err) {
      console.error('Exception when adding review:', err);
      setError(err instanceof Error ? err.message : 'Unknown error saving review');
      
      // Ensure localStorage is updated even if Supabase operation fails
      const updatedReviews = [newReview, ...reviews.filter(r => r.id !== newReview.id)];
      localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
    }

    return newReview;
  };

  return { reviews, addReview, isLoading, error };
};

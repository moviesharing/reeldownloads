import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";

// Initialize Supabase client
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
  const { toast } = useToast();

  // Fetch reviews from Supabase when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('movieId', movieId)
          .order('createdAt', { ascending: false });

        if (error) {
          console.error('Error fetching reviews:', error);
          toast({
            title: "Error fetching reviews",
            description: error.message,
            variant: "destructive",
          });
          
          // Fallback to localStorage if Supabase fails
          const storedReviews = localStorage.getItem(`reviews-${movieId}`);
          if (storedReviews) {
            setReviews(JSON.parse(storedReviews));
          }
        } else {
          setReviews(data || []);
        }
      } catch (err) {
        console.error('Exception when fetching reviews:', err);
        
        // Fallback to localStorage on exception
        const storedReviews = localStorage.getItem(`reviews-${movieId}`);
        if (storedReviews) {
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

    try {
      // Insert into Supabase
      const { error } = await supabase
        .from('reviews')
        .insert([newReview]);

      if (error) {
        console.error('Error adding review to Supabase:', error);
        toast({
          title: "Error saving review",
          description: error.message,
          variant: "destructive",
        });
        
        // Fallback to localStorage if Supabase fails
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
      } else {
        // Update local state with the new review
        setReviews(prevReviews => [newReview, ...prevReviews]);
        
        // Also keep localStorage in sync (as backup)
        const updatedReviews = [newReview, ...reviews];
        localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
        
        toast({
          title: "Review saved",
          description: "Your review has been successfully saved.",
        });
      }
    } catch (err) {
      console.error('Exception when adding review:', err);
      
      // Fallback to localStorage on exception
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
    }

    return newReview;
  };

  return { reviews, addReview, isLoading };
};

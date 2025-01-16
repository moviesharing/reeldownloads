import { useState, useEffect } from "react";

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

  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews-${movieId}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, [movieId]);

  const addReview = (review: Omit<Review, "id" | "createdAt">) => {
    const newReview = {
      ...review,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${movieId}`, JSON.stringify(updatedReviews));
    return newReview;
  };

  return { reviews, addReview };
};
import { useState, useEffect } from 'react';

const MAX_RECENT_MOVIES = 4;

export interface RecentMovie {
  id: number;
  title: string;
  year: number;
  rating: number;
  medium_cover_image: string;
}

export const useRecentlyViewed = () => {
  const [recentMovies, setRecentMovies] = useState<RecentMovie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentMovies(JSON.parse(stored));
    }
  }, []);

  const addMovie = (movie: RecentMovie) => {
    setRecentMovies((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      const newRecent = [movie, ...filtered].slice(0, MAX_RECENT_MOVIES);
      localStorage.setItem('recentlyViewed', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  return { recentMovies, addMovie };
};
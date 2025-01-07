import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import MovieCard from "@/components/MovieCard";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    document.title = "Search Movies - MovieDownloads";
  }, []);

  const { data: movies, isLoading } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm) return { movies: [] };
      const response = await axios.get(
        `https://yts.mx/api/v2/list_movies.json?query_term=${debouncedSearchTerm}`
      );
      return response.data.data;
    },
    enabled: debouncedSearchTerm.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <Input
          type="search"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl"
        />
        <Button type="submit">Search</Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {movies?.movies?.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {movies?.movies?.length === 0 && debouncedSearchTerm && (
        <p className="text-center text-gray-500">No movies found</p>
      )}
    </div>
  );
};

export default Search;
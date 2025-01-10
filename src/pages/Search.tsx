import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "@/components/MovieGrid";
import Advertisement from "@/components/Advertisement";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  const { data: movies, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await axios.get(
        `https://yts.mx/api/v2/list_movies.json?query_term=${query}`
      );
      return response.data.data.movies || [];
    },
    enabled: !!query,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchTerm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Advertisement />
      <form onSubmit={handleSearch} className="mb-8 flex gap-4 justify-center max-w-2xl mx-auto">
        <Input
          type="search"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Search</Button>
      </form>

      {query && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            Search Results for "{query}"
          </h2>
        </div>
      )}

      <MovieGrid movies={movies || []} isLoading={isLoading} />
      <Advertisement />
    </div>
  );
};

export default Search;
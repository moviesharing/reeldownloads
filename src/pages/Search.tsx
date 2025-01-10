import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MovieGrid } from "@/components/MovieGrid";
import Advertisement from "@/components/Advertisement";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Advertisement />
      <div className="mb-8 flex justify-center max-w-2xl mx-auto">
        <SearchBar />
      </div>

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
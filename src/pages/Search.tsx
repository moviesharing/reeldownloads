import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchBar } from "@/components/SearchBar";
import axios from "axios";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const response = await axios.get(
        `https://yts.mx/api/v2/list_movies.json?query_term=${query}`
      );
      return response.data.data.movies;
    },
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 space-y-4">
          <div className="flex justify-center">
            <SearchBar />
          </div>
          <h2 className="text-center text-2xl font-semibold">
            Search results for: {query}
          </h2>
        </div>
        <MovieGrid movies={data || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Search;
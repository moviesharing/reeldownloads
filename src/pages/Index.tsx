import { useQuery } from "@tanstack/react-query";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchBar } from "@/components/SearchBar";
import NavigationBar from "@/components/NavigationBar";
import axios from "axios";

const Index = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axios.get("https://yts.mx/api/v2/list_movies.json");
      return response.data.data.movies;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Download HD Movies
            </h1>
            <p className="text-lg text-gray-400">
              Browse and download your favorite movies in high quality
            </p>
            <div className="md:hidden flex justify-center">
              <SearchBar />
            </div>
          </div>
          <MovieGrid movies={data || []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
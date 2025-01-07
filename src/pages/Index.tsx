import { useQuery } from "@tanstack/react-query";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchBar } from "@/components/SearchBar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

const qualities = ["720p", "1080p", "2160p", "3D"];
const genres = [
  "All", "Action", "Adventure", "Animation", "Biography", "Comedy", 
  "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", 
  "Game-Show", "History", "Horror", "Music", "Musical", "Mystery", 
  "News", "Reality-TV", "Romance", "Sci-Fi", "Sport", "Talk-Show", 
  "Thriller", "War", "Western"
];
const years = ["2024", "2023", "2022", "2021", "2020"];
const ratings = ["9", "8", "7", "6", "5"];
const languages = ["en", "es", "fr", "de", "it"];
const orderBy = ["latest", "oldest", "rating", "download_count", "like_count"];

const Index = () => {
  const [filters, setFilters] = useState({
    quality: "",
    genre: "",
    year: "",
    rating: "",
    language: "",
    sort_by: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["movies", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.quality) params.append("quality", filters.quality);
      if (filters.genre && filters.genre !== "All") params.append("genre", filters.genre);
      if (filters.year) params.append("year", filters.year);
      if (filters.rating) params.append("minimum_rating", filters.rating);
      if (filters.language) params.append("language", filters.language);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      
      params.append("limit", "20");
      params.append("page", "1");

      const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?${params.toString()}`);
      return response.data.data.movies;
    },
  });

  const handleFilterClick = (category: string, value: string) => {
    setFilters(prev => {
      if (prev[category as keyof typeof prev] === value) {
        return {
          ...prev,
          [category]: ""
        };
      }
      return {
        ...prev,
        [category]: value
      };
    });
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Download HD Movies
          </h1>
          <p className="text-lg text-gray-400">
            Browse and download your favorite movies in high quality
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
          <div className="flex justify-center pt-4">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: "Quality", items: qualities, key: "quality" },
                  { label: "Genre", items: genres, key: "genre" },
                  { label: "Year", items: years, key: "year" },
                  { label: "Rating", items: ratings, key: "rating" },
                  { label: "Language", items: languages, key: "language" },
                  { label: "Order By", items: orderBy, key: "sort_by" },
                ].map((category) => (
                  <NavigationMenuItem key={category.label}>
                    <NavigationMenuTrigger>
                      {category.label}: {filters[category.key as keyof typeof filters] || "All"}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-1 p-4 w-40">
                        {category.items.map((item) => (
                          <Button
                            key={item}
                            variant={filters[category.key as keyof typeof filters] === item ? "default" : "ghost"}
                            className="justify-start"
                            onClick={() => handleFilterClick(category.key, item)}
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <MovieGrid movies={data || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
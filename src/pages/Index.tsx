import { useQuery } from "@tanstack/react-query";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchBar } from "@/components/SearchBar";
import NavigationBar from "@/components/NavigationBar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";

const qualities = ["720p", "1080p", "2160p", "3D"];
const genres = [
  "All", "Action", "Adventure", "Animation", "Biography", "Comedy", 
  "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", 
  "Game-Show", "History", "Horror", "Music", "Musical", "Mystery", 
  "News", "Reality-TV", "Romance", "Sci-Fi", "Sport", "Talk-Show", 
  "Thriller", "War", "Western"
];
const years = ["2024", "2023", "2022", "2021", "2020"];
const ratings = ["9+", "8+", "7+", "6+", "5+"];
const languages = ["English", "Spanish", "French", "German", "Italian"];
const orderBy = ["Latest", "Oldest", "Rating", "Downloads", "Likes"];

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
            <div className="flex justify-center">
              <SearchBar />
            </div>
            <div className="flex justify-center pt-4">
              <NavigationMenu>
                <NavigationMenuList className="flex flex-wrap gap-2 justify-center">
                  {[
                    { label: "Quality", items: qualities },
                    { label: "Genre", items: genres },
                    { label: "Year", items: years },
                    { label: "Rating", items: ratings },
                    { label: "Language", items: languages },
                    { label: "Order By", items: orderBy },
                  ].map((category) => (
                    <NavigationMenuItem key={category.label}>
                      <NavigationMenuTrigger>{category.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-1 p-4 w-40">
                          {category.items.map((item) => (
                            <Button
                              key={item}
                              variant="ghost"
                              className="justify-start"
                              onClick={() => console.log(`Selected ${item} in ${category.label}`)}
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
    </div>
  );
};

export default Index;
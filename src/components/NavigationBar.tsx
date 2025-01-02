import { Film } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const qualities = ["720p", "1080p", "2160p", "3D"];
const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"];
const years = ["2024", "2023", "2022", "2021", "2020"];
const ratings = ["9+", "8+", "7+", "6+", "5+"];
const languages = ["English", "Spanish", "French", "German", "Italian"];
const orderBy = ["Latest", "Oldest", "Rating", "Downloads", "Likes"];

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2 mr-6">
          <Film className="h-6 w-6" />
          <span className="text-lg font-bold">MovieDownloads</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-2">
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
    </nav>
  );
};

export default NavigationBar;
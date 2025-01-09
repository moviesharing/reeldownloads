import { Film } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2 mr-6">
          <Film className="h-6 w-6" />
          <span className="text-lg font-bold">MovieDownloads</span>
        </Link>
        <SearchBar />
      </div>
    </nav>
  );
};

export default NavigationBar;
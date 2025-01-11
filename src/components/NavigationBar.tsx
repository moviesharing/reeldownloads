import { Film } from "lucide-react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Film className="h-6 w-6" />
          <span className="text-lg font-bold">MovieDownloads</span>
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/blog" className="text-sm font-medium transition-colors hover:text-primary">
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
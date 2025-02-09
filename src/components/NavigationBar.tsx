import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/33af9f7b-8189-4a40-aafe-1a20de963eda.png" 
            alt="ReelDownloads Logo" 
            className="h-8 w-8"
          />
          <span className="text-lg font-bold">ReelDownloads</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/blog" className="text-sm font-medium transition-colors hover:text-primary">
            Blog
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
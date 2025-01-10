import { Input } from "./ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <Input
        type="search"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-12 bg-white/5 text-white placeholder:text-gray-400 w-full"
      />
    </form>
  );
};
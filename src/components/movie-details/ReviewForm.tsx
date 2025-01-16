import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

interface ReviewFormProps {
  movieId: number;
  onSubmit: (review: { rating: number; comment: string; author: string }) => void;
}

const ReviewForm = ({ movieId, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Review required",
        description: "Please write a review before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!author.trim()) {
      toast({
        title: "Name required",
        description: "Please provide your name before submitting",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ rating, comment, author });
    setRating(0);
    setComment("");
    setAuthor("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1"
            >
              <Star
                className={`h-6 w-6 ${
                  value <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium mb-2">
          Your Name
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label htmlFor="review" className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <Textarea
          id="review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  );
};

export default ReviewForm;
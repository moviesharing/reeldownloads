
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  movieId: number;
  movieTitle: string;
  qualities: {
    quality: string;
    type: string;
    size: string;
    url: string;
  }[];
}

const VideoPlayer = ({ movieId, movieTitle, qualities }: VideoPlayerProps) => {
  const [selectedQuality, setSelectedQuality] = useState<string>(
    qualities.length > 0 ? qualities[0].quality : ""
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const currentQuality = qualities.find(q => q.quality === selectedQuality);
  
  useEffect(() => {
    // Reset player state when quality changes
    setIsPlaying(false);
  }, [selectedQuality]);

  if (qualities.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-800 rounded-lg">
        <p>No streaming options available for this movie.</p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      {isPlaying ? (
        <div className="aspect-video w-full bg-black relative">
          <iframe
            src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`}
            title={`${movieTitle} - ${selectedQuality}`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <Button 
            variant="outline" 
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
            onClick={() => setIsPlaying(false)}
          >
            Close Player
          </Button>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold">Watch Online: {movieTitle}</h3>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <label htmlFor="quality-select" className="block text-sm font-medium">
                Select Quality:
              </label>
              <Select 
                value={selectedQuality} 
                onValueChange={setSelectedQuality}
              >
                <SelectTrigger className="w-[180px]" id="quality-select">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  {qualities.map((quality) => (
                    <SelectItem key={quality.quality} value={quality.quality}>
                      {quality.quality} ({quality.size})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button 
                onClick={() => setIsPlaying(true)}
                className="flex-1 sm:flex-none"
              >
                Stream Now
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-none"
                asChild
              >
                <a 
                  href={currentQuality?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 space-y-1 border-t border-gray-700 pt-4 mt-4">
            <p>Current selection: {currentQuality?.quality} ({currentQuality?.type})</p>
            <p>File size: {currentQuality?.size}</p>
            <p className="text-xs">Note: Actual streaming would require server-side implementation</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VideoPlayer;

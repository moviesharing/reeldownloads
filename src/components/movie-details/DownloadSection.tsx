
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";

interface Torrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}

interface DownloadSectionProps {
  torrents: Torrent[];
  movieId: number;
  movieTitle: string;
}

const DownloadSection = ({ torrents = [], movieId, movieTitle }: DownloadSectionProps) => {
  const [mode, setMode] = useState<"stream" | "download">("stream");

  const streamQualities = torrents.map(torrent => ({
    quality: torrent.quality,
    type: torrent.type,
    size: torrent.size,
    url: torrent.url
  }));

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Watch "{movieTitle}"</CardTitle>
          <div className="flex items-center bg-secondary rounded-lg p-1">
            <Toggle 
              pressed={mode === "stream"} 
              onPressedChange={() => setMode("stream")}
              className="rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Stream
            </Toggle>
            <Toggle 
              pressed={mode === "download"} 
              onPressedChange={() => setMode("download")}
              className="rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Download
            </Toggle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {mode === "stream" ? (
          <VideoPlayer 
            movieId={movieId}
            movieTitle={movieTitle}
            qualities={streamQualities}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {torrents.map((torrent) => (
              <Card key={torrent.hash} className="bg-card/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{torrent.quality}</h3>
                        <p className="text-sm text-gray-400">{torrent.type}</p>
                      </div>
                      <span className="text-sm bg-secondary px-2 py-1 rounded">
                        {torrent.size}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Seeds: {torrent.seeds}</span>
                      <span>Peers: {torrent.peers}</span>
                    </div>
                    <Button asChild className="w-full">
                      <a
                        href={torrent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadSection;

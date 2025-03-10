
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, File, Monitor, Clock, Volume2, Maximize } from "lucide-react";

interface Torrent {
  url: string;
  quality: string;
  size: string;
  type: string;
}

interface DownloadSectionProps {
  torrents: Torrent[];
}

const DownloadSection = ({ torrents }: DownloadSectionProps) => {
  // Group torrents by their quality and type
  const groupedTorrents = torrents?.reduce((acc: Record<string, Torrent>, torrent) => {
    const key = `${torrent.quality}-${torrent.type}`;
    acc[key] = torrent;
    return acc;
  }, {});

  // Get format label for a quality/type combination
  const getFormatLabel = (quality: string, type: string) => {
    const qualityValue = quality.split(".")[0];
    const formatType = type === "bluray" ? "BLU" : "WEB";
    
    // Check if it's a high quality format (typically x265 for 1080p.WEB or 2160p.WEB)
    const isX265 = 
      (qualityValue === "1080" || qualityValue === "2160") && 
      formatType === "WEB";
    
    return (
      <span className="whitespace-nowrap">
        {qualityValue}p.{formatType}
        {isX265 && <span className="text-green-500 ml-1">x265</span>}
      </span>
    );
  };

  // Set the keys of the torrents for tabs
  const torrentKeys = Object.keys(groupedTorrents);
  
  // Set default selected quality if available
  const [selectedQuality, setSelectedQuality] = useState<string>(
    torrentKeys.length > 0 ? torrentKeys[0] : ""
  );

  // Get technical details for the selected torrent
  const getTorrentDetails = (torrentKey: string) => {
    const torrent = groupedTorrents[torrentKey];
    if (!torrent) return null;

    const qualityValue = torrent.quality.split(".")[0];
    
    return {
      fileSize: torrent.size,
      audio: "English 2.0",
      resolution: qualityValue === "720" ? "1280*534" : qualityValue === "1080" ? "1920*800" : "3840*1600",
      videoQuality: "NR",
      frameRate: "60 fps",
      duration: "1 hr 54 min",
      seeds: "100+",
      url: torrent.url
    };
  };

  // Function to handle tab change
  const handleTabChange = (value: string) => {
    setSelectedQuality(value);
  };

  // Get current torrent details
  const currentTorrentDetails = selectedQuality ? getTorrentDetails(selectedQuality) : null;

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold">Downloads</h2>
      
      {torrents && torrents.length > 0 ? (
        <div className="bg-gray-900 rounded-md overflow-hidden">
          <Tabs 
            value={selectedQuality}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="overflow-x-auto">
              <TabsList className="w-full flex bg-gray-900 rounded-none min-w-max">
                {torrentKeys.map((key) => {
                  const [quality, type] = key.split("-");
                  return (
                    <TabsTrigger 
                      key={key} 
                      value={key}
                      className="data-[state=active]:bg-black data-[state=active]:text-white py-3 flex-1"
                    >
                      {getFormatLabel(quality, type)}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            
            {currentTorrentDetails && (
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
                  {/* File Size */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <File className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{currentTorrentDetails.fileSize}</span>
                  </div>
                  
                  {/* Resolution */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Maximize className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{currentTorrentDetails.resolution}</span>
                  </div>
                  
                  {/* Audio */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Volume2 className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{currentTorrentDetails.audio}</span>
                  </div>
                  
                  {/* Video Quality */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Monitor className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{currentTorrentDetails.videoQuality}</span>
                  </div>
                  
                  {/* Frame Rate */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Monitor className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{currentTorrentDetails.frameRate}</span>
                  </div>
                  
                  {/* Duration */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{currentTorrentDetails.duration}</span>
                  </div>
                </div>
                
                {/* Seeds - Full width */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-gray-300">Seeds</span>
                  <span className="text-green-500">{currentTorrentDetails.seeds}</span>
                </div>
                
                {/* Download Button */}
                <div className="mt-4">
                  <Button
                    className="w-full"
                    variant="secondary"
                    asChild
                  >
                    <a href={currentTorrentDetails.url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </div>
      ) : (
        <div className="bg-gray-900 text-gray-400 rounded-md p-4 text-center">
          No download options available for this title.
        </div>
      )}
    </motion.div>
  );
};

export default DownloadSection;

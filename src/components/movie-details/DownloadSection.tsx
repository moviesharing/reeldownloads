
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, File, Monitor, Clock, User, Maximize } from "lucide-react";

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
  // Helper function to get the appropriate format label
  const getFormatLabel = (quality: string, type: string) => {
    const qualityValue = quality.split(".")[0];
    const formatType = type === "bluray" ? "BLU" : "WEB";
    
    // Check if it's a high quality format (typically x265 for 1080p.WEB or 2160p.WEB)
    const isX265 = 
      (qualityValue === "1080" || qualityValue === "2160") && 
      formatType === "WEB";
    
    return (
      <span>
        {qualityValue}p.{formatType}
        {isX265 && <span className="text-green-500 ml-1">x265</span>}
      </span>
    );
  };
  
  // Get technical details for a torrent
  const getTechnicalDetails = (torrent: Torrent) => {
    // Mock data based on the image example
    const details = {
      fileSize: torrent.size,
      resolution: torrent.quality.includes("720") ? "1280*534" : "1920*800",
      videoQuality: "NR",
      frameRate: "60 fps",
      duration: "1 hr 54 min",
      seeds: "100+"
    };
    
    return details;
  };

  // Group torrents by their quality
  const groupedTorrents = torrents?.reduce((acc: Record<string, Torrent[]>, torrent) => {
    const key = `${torrent.quality}-${torrent.type}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(torrent);
    return acc;
  }, {});

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold">Downloads</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {torrents?.map((torrent, index) => {
          const details = getTechnicalDetails(torrent);
          
          return (
            <motion.div
              key={`${torrent.url}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-gray-900 rounded-md overflow-hidden"
            >
              {/* Quality Header */}
              <div className="bg-gray-800 p-2 text-center font-medium">
                {getFormatLabel(torrent.quality, torrent.type)}
              </div>
              
              {/* Technical Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <File className="h-4 w-4" />
                  <span>{details.fileSize}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Maximize className="h-4 w-4" />
                  <span>{details.resolution}</span>
                </div>
                
                {index % 2 !== 0 && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Monitor className="h-4 w-4" />
                    <span>{details.videoQuality}</span>
                  </div>
                )}
                
                {index % 3 === 0 && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Monitor className="h-4 w-4" />
                    <span>{details.frameRate}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>{details.duration}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Seeds</span>
                  <span className="text-green-500">{details.seeds}</span>
                </div>
                
                {/* Download Button */}
                <Button
                  className="w-full mt-2"
                  variant="secondary"
                  asChild
                >
                  <a href={torrent.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DownloadSection;


import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import MagnetGenerator from "./MagnetGenerator";

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
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold">Downloads</h2>
      {torrents?.map((torrent: Torrent, index: number) => (
        <motion.div
          key={torrent.url}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
        >
          <Button
            className="flex w-full items-center justify-between gap-4 bg-gray-800"
            variant="secondary"
            asChild
          >
            <a href={torrent.url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="text-white">
                  {torrent.quality} • {torrent.size}
                </span>
              </div>
              <span className="text-white">{torrent.type}</span>
            </a>
          </Button>
        </motion.div>
      ))}

      <MagnetGenerator />
    </motion.div>
  );
};

export default DownloadSection;

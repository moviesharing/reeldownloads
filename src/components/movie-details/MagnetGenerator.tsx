
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const MagnetGenerator = () => {
  const [torrentHash, setTorrentHash] = useState("");
  const [movieName, setMovieName] = useState("");
  const [magnetUrl, setMagnetUrl] = useState("");

  const trackers = [
    "udp://open.demonii.com:1337/announce",
    "udp://tracker.openbittorrent.com:80",
    "udp://tracker.coppersurfer.tk:6969",
    "udp://glotorrents.pw:6969/announce",
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://torrent.gresille.org:80/announce",
    "udp://p4p.arenabg.com:1337",
    "udp://tracker.leechers-paradise.org:6969",
    "udp://tracker.internetwarriors.net:1337"
  ];

  const generateMagnetUrl = () => {
    if (!torrentHash.trim()) {
      toast.error("Please enter a valid torrent hash");
      return;
    }

    if (!movieName.trim()) {
      toast.error("Please enter a movie name");
      return;
    }

    const encodedName = encodeURIComponent(movieName);
    let url = `magnet:?xt=urn:btih:${torrentHash}&dn=${encodedName}`;
    
    // Add trackers
    trackers.forEach(tracker => {
      url += `&tr=${encodeURIComponent(tracker)}`;
    });
    
    setMagnetUrl(url);
    toast.success("Magnet URL generated successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(magnetUrl)
      .then(() => {
        toast.success("Magnet URL copied to clipboard!");
      })
      .catch(err => {
        toast.error("Failed to copy: " + err);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-5 rounded-lg bg-gray-800 shadow-md space-y-4 mt-6"
    >
      <h3 className="text-xl font-semibold text-white">Generate Magnet URL</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="torrentHash" className="block text-sm font-medium text-gray-300 mb-1">
            Torrent Hash (BTIH)
          </label>
          <Input
            id="torrentHash"
            value={torrentHash}
            onChange={(e) => setTorrentHash(e.target.value)}
            placeholder="e.g., abcdef1234567890abcdef1234567890abcdef12"
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="movieName" className="block text-sm font-medium text-gray-300 mb-1">
            Movie Name
          </label>
          <Input
            id="movieName"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="e.g., The Matrix (1999)"
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>

        <Button 
          onClick={generateMagnetUrl} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Generate Magnet URL
        </Button>

        {magnetUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-300">
                Generated Magnet URL
              </label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="text-blue-400 hover:text-blue-300"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="p-3 bg-gray-900 rounded border border-gray-700 text-sm text-gray-300 break-all">
              {magnetUrl}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MagnetGenerator;

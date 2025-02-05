import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGoogleMap, useMediaViewer } from "@/stores/overlay";
import { cn } from "@/lib/utils";

import GoogleMapWidget from "../widgets/google_map_widget";
import MediaViewer from "../widgets/file_reader_widget";

interface GoogleMapLocationModalProps {
  width?: string; // Allows dynamic width control (e.g., "max-w-md", "w-full")
}

const FileReaderModal: React.FC<GoogleMapLocationModalProps> = ({
  width = "max-w-[80vw]", // Default width to 80vw
}) => {
  const { url, shows, setShows, type } = useMediaViewer();

  return (
    <Dialog open={shows} onOpenChange={setShows}>
      <DialogContent
        className={cn(
          "overflow-hidden rounded-lg focus-visible:outline-none",
          width,
        )}
        style={{ width: "80vw", height: "80vh", padding: "20px" }} // Ensure width applies
      >
        <DialogHeader className="absolute left-0 top-0 z-10 w-full space-y-0 border-b border-[#F2F2F2] bg-white p-5 text-left">
          <DialogTitle
            className={cn(
              "font-poppins text-lg font-medium leading-[21px] text-[#333]",
            )}
          >
            {type} response
          </DialogTitle>
          <span
            onClick={() => setShows(false)}
            className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
          >
            <X size={20} />
          </span>
        </DialogHeader>

        <div className="mt-5" />
        <MediaViewer type={type} url={url} />
      </DialogContent>
    </Dialog>
  );
};

export default FileReaderModal;

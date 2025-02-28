import { FC, useEffect, useState } from "react";
import { CircleEllipsis, Eye, LocateIcon } from "lucide-react";

interface LocationFileProps {
  imageUrl?: any;
  onClick: () => void; // Define onClick as a function
}

const LocationFile: FC<LocationFileProps> = ({ imageUrl, onClick }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const size = 48; // Thumbnail size
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, 0, 0, size, size);

        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7); // Compress to JPEG
        setThumbnail(thumbnailUrl);
      };
    };

    generateThumbnail();
  }, [imageUrl]);

  return (
    <div
      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-[#F8F8F8] p-2 transition hover:bg-gray-200"
      onClick={onClick} // Clickable container
    >
      <LocateIcon />
      <div className="flex flex-1 flex-col overflow-hidden">
        <span className="max-w-[300px] overflow-hidden truncate text-ellipsis text-nowrap text-sm font-medium text-gray-900">
          {imageUrl?.address || "Click to view"}
        </span>
      </div>
      <button
        className="rounded-full bg-[#ECECEC] p-2 text-gray-400"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent `onClick`
          onClick();
        }}
      >
        <Eye size={20} />
      </button>
    </div>
  );
};

export default LocationFile;

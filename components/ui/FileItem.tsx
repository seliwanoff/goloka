import { FC, useEffect, useState } from "react";
import { CircleEllipsis, Eye } from "lucide-react";

interface FileItemProps {
  imageUrl: string; // Can be an image or video
  fileName: string;
  fileSize: string;
  onClick?: () => void;
}

const FileItem: FC<FileItemProps> = ({
  imageUrl,
  fileName,
  fileSize,
  onClick,
}) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!imageUrl) return;

      // Check if it's a video
      if (
        imageUrl.endsWith(".mp4") ||
        imageUrl.endsWith(".mov") ||
        imageUrl.endsWith(".webm")
      ) {
        const video = document.createElement("video");
        video.src = imageUrl;
        video.crossOrigin = "anonymous";
        video.currentTime = 2; // Capture frame at 2s

        video.onloadeddata = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          canvas.width = 48;
          canvas.height = 48;

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setThumbnail(canvas.toDataURL("image/jpeg", 0.7)); // Convert to image
        };
      } else {
        // Handle image thumbnails
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          canvas.width = 48;
          canvas.height = 48;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          setThumbnail(canvas.toDataURL("image/jpeg", 0.7));
        };
      }
    };

    generateThumbnail();
  }, [imageUrl]);

  return (
    <div
      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-[#F8F8F8] p-2 transition hover:bg-gray-200"
      onClick={() => onClick?.()}
    >
      <img
        src={thumbnail || imageUrl} // Show generated thumbnail or original file preview
        alt="File preview"
        className="h-12 w-12 rounded-lg object-cover"
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <span className="truncate text-sm font-medium text-gray-900">
          {fileName}
        </span>
        <span className="text-xs text-gray-500">{fileSize}</span>
      </div>
      <button
        className="rounded-full bg-[#ECECEC] p-2 text-gray-400 transition hover:bg-gray-300"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <Eye size={20} />
      </button>
    </div>
  );
};

export default FileItem;

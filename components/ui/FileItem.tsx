import { FC, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Image from "next/image";
import Pattern from "@/public/assets/images/video.png";
import file from "@/public/assets/images/svg/pdf-file-icon.svg";

interface FileItemProps {
  imageUrl: string; // Can be an image, video, or other file
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
  const isVideo = /\.(mp4|mov|webm)$/i.test(imageUrl);
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!imageUrl || !isImage) return;

      const img = new window.Image();
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
    };

    generateThumbnail();
  }, [imageUrl, isImage]);

  return (
    <div
      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-[#F8F8F8] p-2 transition hover:bg-gray-200"
      onClick={() => onClick?.()}
    >
      {/* Thumbnail for images */}
      {fileName === "photo" && (
        <img
          src={thumbnail || imageUrl}
          alt="File preview"
          className="h-12 w-12 rounded-lg object-cover"
        />
      )}

      {/* Video thumbnail */}
      {fileName === "video" && (
        <div className="relative h-12 w-12">
          <Image
            src={Pattern} // Default video background
            alt="Video preview"
            className="absolute left-0 top-0 h-12 w-12 object-cover opacity-40"
          />
          <video src={imageUrl} className="h-12 w-12 rounded-lg object-cover" />
        </div>
      )}

      {/* Default file icon for non-image/video files */}
      {fileName === "file" && (
        <Image
          src={file}
          alt="File icon"
          className="h-12 w-12 object-cover opacity-40"
        />
      )}

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

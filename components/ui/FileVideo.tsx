import { FC, useEffect, useRef, useState } from "react";
import { CircleEllipsis } from "lucide-react";

interface FileItemProps {
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: "image" | "video";
}

const FileVideo: FC<FileItemProps> = ({
  fileUrl,
  fileName,
  fileSize,
  fileType,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (fileType === "video" && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      video.addEventListener("loadeddata", () => {
        video.currentTime = 2; // Capture a frame at 2 seconds
      });

      video.addEventListener("seeked", () => {
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setThumbnail(canvas.toDataURL("image/png"));
        }
      });
    }
  }, [fileUrl, fileType]);

  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-gray-100 p-2 shadow-sm">
      {fileType === "image" ? (
        <img
          src={fileUrl}
          alt="File preview"
          className="h-12 w-12 rounded-lg object-cover"
        />
      ) : (
        <>
          <video ref={videoRef} src={fileUrl} className="hidden" />
          <canvas ref={canvasRef} className="hidden" />
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Video thumbnail"
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-300" />
          )}
        </>
      )}
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-gray-900">{fileName}</span>
        <span className="text-xs text-gray-500">{fileSize}</span>
      </div>
      <button className="p-2 text-gray-400 hover:text-gray-600">
        <CircleEllipsis size={20} />
      </button>
    </div>
  );
};

export default FileVideo;

"use client";

import { FC } from "react";
import ReactPlayer from "react-player"; // Import react-player

interface MediaViewerProps {
  type: "video" | "image" | "document"; // Type of media
  url: string; // URL of the file
}

const MediaViewer: FC<MediaViewerProps> = ({ type, url }) => {
  if (!url) {
    return <p className="text-center text-gray-500">No file selected</p>;
  }

  return (
    <div className="mx-auto flex w-full items-center justify-center rounded-lg border bg-white p-4">
      {/* Advanced Video Player */}
      {type === "video" && (
        <div className="w-full max-w-2xl">
          <ReactPlayer
            url={url}
            controls
            width="100%"
            height="50%"
            playing={false} // Autoplay off
            light={false} // Show thumbnail preview
            pip // Enable Picture-in-Picture mode
            config={{
              file: { attributes: { controlsList: "download" } }, // Disable video download
            }}
            className="rounded-md object-center shadow-lg"
          />
        </div>
      )}

      {/* Image Viewer */}
      {type === "image" && (
        <img
          src={url}
          alt="Uploaded image"
          className="mb-5 h-auto w-full overflow-hidden rounded-md"
        />
      )}

      {/* Document Viewer */}
      {type === "document" && url && (
        <div className="h-96 w-full">
          {/* Handle PDFs */}
          {url.toLowerCase().endsWith(".pdf") ? (
            <iframe
              src={url}
              className="h-full w-full rounded-md border"
              title="PDF Viewer"
            />
          ) : /* Handle Images */
          /\.(png|jpe?g)$/i.test(url.split("?")[0]) ? (
            <img
              src={url}
              alt="Uploaded Image"
              className="h-full w-full rounded-md border object-contain"
            />
          ) : (
            /* Handle Other Document Types (DOC, DOCX, XLSX, etc.) */
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
              className="h-full w-full rounded-md border"
              title="Document Viewer"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;

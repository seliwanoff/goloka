"use client";

import { FC } from "react";

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
      {type === "video" && (
        <video controls className="h-auto w-full overflow-hidden rounded-md">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {type === "image" && (
        <img
          src={url}
          alt="Uploaded image"
          className="mb-5 h-auto w-full overflow-hidden rounded-md"
        />
      )}

      {type === "document" && (
        <div className="h-96 w-full">
          {url.endsWith(".pdf") ? (
            <iframe
              src={url}
              className="h-full w-full rounded-md border"
              title="PDF Viewer"
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-700">File: {url.split("/").pop()}</p>
              <a
                href={url}
                download
                className="mt-2 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;

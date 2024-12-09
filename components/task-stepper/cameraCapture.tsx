import React, { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";

interface Question {
  id: string;
  label?: string;
}

interface CameraCaptureProps {
  ques: Question;
  setSelectedValues: React.Dispatch<
    React.SetStateAction<Record<string, File | null>>
  >;
  setFilePreviews: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  defaultImageUrl?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  ques,
  setSelectedValues,
  setFilePreviews,
  defaultImageUrl,
}) => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Use default image URL if provided
  useEffect(() => {
    if (defaultImageUrl) {
      setFilePreviews((prev) => ({
        ...prev,
        [ques.id]: defaultImageUrl.replace(/\\/g, ""), // Remove escape slashes
      }));
    }
  }, [defaultImageUrl, ques.id, setFilePreviews]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && cameraStream) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        stopCamera();

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "captured-image.jpg", {
                type: "image/jpeg",
              });

              if (file.size <= 1 * 1024 * 1024) {
                const previewUrl = URL.createObjectURL(file);

                setSelectedValues((prev) => ({
                  ...prev,
                  [ques.id]: file,
                }));
                setFilePreviews((prev) => ({
                  ...prev,
                  [ques.id]: previewUrl,
                }));
              } else {
                alert("Image size exceeds 1MB limit");
                startCamera();
              }
            }
          },
          "image/jpeg",
          0.7,
        );
      } catch (error) {
        console.error("Error capturing image:", error);
        alert("Failed to capture image");
      }
    }
  };

  const removeImage = () => {
    setSelectedValues((prev) => ({
      ...prev,
      [ques.id]: null,
    }));
    setFilePreviews((prev) => ({
      ...prev,
      [ques.id]: "",
    }));
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="col-span-2">
      <div className="flex flex-col gap-4">
        {!cameraStream && !filePreviews[ques.id] && (
          <div
            onClick={startCamera}
            className="relative flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] text-center"
          >
            <div className="flex flex-col items-center">
              <div className="flex w-fit flex-col rounded-lg px-4 py-2 text-sm font-medium text-[#3365E3]">
                <div className="mb-2 flex h-8 w-8 items-center justify-center self-center rounded-full border border-dashed border-slate-300 bg-slate-200">
                  <Camera />
                </div>
                <span>Take Photo</span>
              </div>
              <span className="text-xs text-slate-400">
                Use device camera (max 1MB)
              </span>
            </div>
          </div>
        )}

        {cameraStream && (
          <div className="relative flex flex-col items-center">
            <div className="w-full max-w-md overflow-hidden rounded-lg">
              <video
                ref={videoRef}
                className="h-auto w-full"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                type="button"
                onClick={captureImage}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {filePreviews[ques.id] && (
          <div className="relative h-32 w-32 overflow-hidden rounded-lg">
            <Image
              src={filePreviews[ques.id]}
              alt="Preview"
              className="h-full w-full object-cover"
              layout="fill"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;

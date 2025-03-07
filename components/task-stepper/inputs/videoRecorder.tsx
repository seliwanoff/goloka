import React, { useRef, useState } from "react";
import { FileVideo2 } from "lucide-react"; // Assuming you're using Lucide icons

const VideoRecorder = ({
  ques,
  handleInputChange,
  selectedValues,
  setSelectedValues,
  setQid,
}: any) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Start recording video
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);

        // Pass the recorded video blob to the parent component
        handleInputChange(blob, ques.id, "file");
        setQid(ques.id);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Failed to access camera. Please ensure you have granted the necessary permissions.",
      );
    }
  };

  // Stop recording video
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks in the stream
      if (videoPreviewRef.current?.srcObject) {
        const stream = videoPreviewRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  // Clear recorded video
  const clearRecordedVideo = () => {
    setRecordedVideo(null);
    setSelectedValues((prev: any) => ({
      ...prev,
      [ques.id]: null,
    }));
    recordedChunksRef.current = [];
  };

  return (
    <div className="col-span-2">
      <div className="flex flex-col gap-4">
        {/* Video Preview */}
        <div className="relative h-40 w-full rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F]">
          {recordedVideo || selectedValues[ques.id] ? (
            <div className="relative h-full w-full">
              <video
                controls
                src={recordedVideo || selectedValues[ques.id]}
                className="h-full w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={clearRecordedVideo}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                className="h-full w-full rounded-lg object-cover"
              />
              {!isRecording && (
                <div className="absolute flex flex-col items-center">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center self-center rounded-full border border-dashed border-slate-300 bg-slate-200">
                    <FileVideo2 />
                  </div>
                  <span className="text-sm font-medium text-[#3365E3]">
                    Record Video
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Record/Stop Button */}
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className="w-fit self-center rounded-lg bg-[#3365E3] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a4fb3]"
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default VideoRecorder;

import React, { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Trash2 } from "lucide-react";
import RecordRTC from "recordrtc";

interface AudioRecorderProps {
  quesId: string | number;
  handleInputChange: (
    value: string | boolean | File | string[],
    quesId: string | number,
    type?: string,
  ) => void;
  defaultAudio?: string | File;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  quesId,
  handleInputChange,
  defaultAudio,
}) => {
  const { StereoAudioRecorder } = RecordRTC;

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<any | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Safely create object URL
  const createObjectURL = (blob: Blob | File | string) => {
    if (
      typeof window !== "undefined" &&
      window.URL &&
      window.URL.createObjectURL
    ) {
      // Type guard to check if input is a Blob or File
      if (typeof blob === "object" && blob !== null && "type" in blob) {
        return window.URL.createObjectURL(blob as Blob | File);
      }
      return blob as string;
    }
    return null;
  };

  // Effect to handle default audio
  useEffect(() => {
    let url: string | null = null;

    if (defaultAudio) {
      // If it's already a URL string, use it directly
      if (typeof defaultAudio === "string") {
        url = defaultAudio;
      }
      // If it's a File, create an object URL
      else if (
        defaultAudio &&
        typeof defaultAudio === "object" &&
        "type" in defaultAudio
      ) {
        url = createObjectURL(defaultAudio);
      }

      if (url) {
        setAudioURL(url);
      }
    }

    // Cleanup function
    return () => {
      if (
        url &&
        typeof window !== "undefined" &&
        window.URL &&
        window.URL.revokeObjectURL
      ) {
        window.URL.revokeObjectURL(url);
      }
    };
  }, [defaultAudio]);

  const startRecording = async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: StereoAudioRecorder,
        desiredSampRate: 16000,
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      setError("Unable to access microphone. Please check permissions.");
      console.error(err);
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        if (blob) {
          const url = createObjectURL(blob);

          if (url) {
            setAudioURL(url);

            const audioFile = new File([blob], `recording-${quesId}.wav`, {
              type: blob.type,
            });

            handleInputChange(audioFile, quesId, "audio");
          }
        }
      });
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    // Revoke the previous object URL to free up memory
    if (
      audioURL &&
      typeof window !== "undefined" &&
      window.URL &&
      window.URL.revokeObjectURL
    ) {
      window.URL.revokeObjectURL(audioURL);
    }

    setAudioURL(null);

    // For deleteRecording, pass an empty array to match the type signature
    handleInputChange([], quesId, "audio");
  };

  return (
    <div className="relative flex h-40 w-full flex-col items-center justify-center space-y-6 rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] p-4 text-center">
      <h2 className="text-center text-sm font-medium text-[#3365E3]">
        Record Audio
      </h2>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!audioURL && (
        <div className="flex flex-col items-center space-y-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <Mic className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 rounded-lg bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
            >
              <StopCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {audioURL && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <audio
              ref={audioRef}
              controls
              src={audioURL}
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <button
              onClick={deleteRecording}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 focus:outline-none focus:ring focus:ring-red-200"
              title="Delete Recording"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500">Play Back Recorded Audio</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

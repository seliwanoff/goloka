import React, { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Trash2 } from "lucide-react";
import RecordRTC from "recordrtc";

interface AudioRecorderProps {
  quesId: string | number;
  handleInputChange: (
    value: File | null,
    quesId: string | number,
    type?: string,
  ) => void;
  defaultAudio?: string | File;

  onInputedAnswerMonitoring?: any;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  quesId,
  handleInputChange,
  defaultAudio,
  onInputedAnswerMonitoring,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize default audio
  useEffect(() => {
    if (typeof defaultAudio === "string") {
      setAudioURL(defaultAudio);
    } else if (defaultAudio instanceof File) {
      setAudioURL(URL.createObjectURL(defaultAudio));
    }
  }, [defaultAudio]);

  // Cleanup resources
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
        },
      });

      mediaStreamRef.current = stream;
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 44100,
        numberOfAudioChannels: 1,
        timeSlice: 1000,
      });

      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      setError("Microphone access denied. Please check browser permissions.");
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    try {
      await new Promise<void>((resolve) => {
        recorderRef.current!.stopRecording(() => resolve());
      });

      const blob = recorderRef.current!.getBlob();
      const file = new File([blob], `recording-${quesId}.wav`, {
        type: "audio/wav",
      });

      const url = URL.createObjectURL(file);
      setAudioURL(url);
      handleInputChange(file, quesId);
    } catch (err) {
      setError("Failed to save recording");
      console.error("Stop recording error:", err);
    } finally {
      cleanupResources();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    cleanupResources();
    setAudioURL(null);
    handleInputChange(null, quesId);
  };

  const cleanupResources = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recorderRef.current) {
      recorderRef.current.destroy();
      recorderRef.current = null;
    }
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  };

  if (typeof window === "undefined") return null;

  return (
    <div className="relative flex h-40 w-full flex-col items-center justify-center space-y-6 rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] p-4 text-center">
      <h2 className="text-center text-sm font-medium text-[#3365E3]">
        Record Audio (WAV)
      </h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!audioURL ? (
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-white shadow-md ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 focus:ring-red-300"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
            } focus:outline-none focus:ring`}
          >
            {isRecording ? (
              <>
                <StopCircle className="h-5 w-5" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                <span>Start Recording</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500">
            {isRecording ? "Recording..." : "Click to start recording"}
          </p>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="flex items-center space-x-4">
            <audio
              controls
              src={audioURL}
              className="flex-1 rounded-md border border-gray-300"
            />
            <button
              onClick={deleteRecording}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 focus:outline-none focus:ring focus:ring-red-200"
              title="Delete Recording"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500">Playback recorded audio</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

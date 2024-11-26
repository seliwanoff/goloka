import React, { useState, useRef } from "react";
import { Mic, StopCircle, Trash2 } from "lucide-react";

interface AudioRecorderProps {
  quesId: string | number;
  handleInputChange: (
    value: string | boolean | File | string[],
    quesId: string | number,
    type?: string
  ) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  quesId,
  handleInputChange
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);

        // Convert Blob to File
        const audioFile = new File([audioBlob], `recording-${quesId}.webm`, {
          type: "audio/webm"
        });

        // Use handleInputChange to update the parent component's state
        handleInputChange(audioFile, quesId, "audio");

        console.log("Recorded Audio File:", audioFile);
        audioChunks.current = []; // Clear the audio chunks for the next recording
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Unable to access microphone. Please check permissions.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioURL(null);
    // Passing null to clear the audio value
    //@ts-ignore
    handleInputChange(null, quesId, "audio");
  };

  return (
    <div className="relative mx-auto flex h-40 max-w-md flex-col items-center justify-center space-y-6 rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] p-4 text-center">
      <h2 className="text-center text-sm font-medium text-[#3365E3]">
        Record Audio
      </h2>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!audioURL && (
        <div className="flex flex-col items-center space-y-4">
          {/* Recording Controls */}
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

          {/* Animated Wave While Recording */}
          {isRecording && (
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 w-1 animate-pulse bg-blue-500"
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Playback and Actions */}
      {audioURL && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <audio
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
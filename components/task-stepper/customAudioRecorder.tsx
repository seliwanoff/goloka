import React, { useState, useRef } from "react";
import { Mic, StopCircle, Trash2 } from "lucide-react";
import RecordRTC from "recordrtc";

interface AudioRecorderProps {
  quesId: string | number;
  handleInputChange: (
    value: string | boolean | File | string[],
    quesId: string | number,
    type?: string,
  ) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  quesId,
  handleInputChange,
}) => {
  const { StereoAudioRecorder } = RecordRTC;

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<any | null>(null);

  const startRecording = async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav", // Choose 'audio/mp3', 'audio/m4a', or 'audio/wav'
        recorderType: StereoAudioRecorder,
        desiredSampRate: 16000, // For higher-quality audio
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
          const audioURL = URL.createObjectURL(blob);
          setAudioURL(audioURL);

          const audioFile = new File(
            [blob],
            `recording-${quesId}.wav`, // Change extension based on mimeType
            { type: blob.type },
          );

          handleInputChange(audioFile, quesId, "audio");
        }
      });
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioURL(null);
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

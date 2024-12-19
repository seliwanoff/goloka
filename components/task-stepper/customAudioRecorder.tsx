import React, { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Trash2 } from "lucide-react";
import RecordRTC from "recordrtc";
import lamejs from 'lamejs';

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
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<any | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const convertToMp3 = (audioBuffer: AudioBuffer): File => {
    const channels = 1; // Mono
    const sampleRate = audioBuffer.sampleRate;
    const mp3Encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);

    // Convert float32 to int16
    const samples = audioBuffer.getChannelData(0);
    const int16Samples = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      int16Samples[i] = Math.max(-32768, Math.min(32767, samples[i] * 32768));
    }

    const mp3Data: number[] = [];
    const blockSize = 1152;

    for (let i = 0; i < int16Samples.length; i += blockSize) {
      const sampleChunk = int16Samples.subarray(i, i + blockSize);
      const mp3Buf = mp3Encoder.encodeBuffer(sampleChunk);
      if (mp3Buf.length > 0) {
        mp3Data.push(...mp3Buf);
      }
    }

    // Finish encoding
    const finalMp3Buf = mp3Encoder.flush();
    if (finalMp3Buf.length > 0) {
      mp3Data.push(...finalMp3Buf);
    }

    // Convert to Blob and then File
    const mp3Blob = new Blob([new Uint8Array(mp3Data)], { type: 'audio/mpeg' });
    return new File([mp3Blob], `recording-${quesId}.mp3`, { type: 'audio/mpeg' });
  };

  const startRecording = async () => {
    setError(null);

    try {
      if (typeof window === "undefined") {
        throw new Error("Cannot record on server-side");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        desiredSampRate: 44100,
      });

      recorder.startRecording();

      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to access microphone. Please check permissions.",
      );
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      return new Promise<void>((resolve) => {
        recorderRef.current!.stopRecording(async () => {
          const blob = recorderRef.current!.getBlob();

          if (blob) {
            try {
              // Convert blob to AudioBuffer
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              const arrayBuffer = await blob.arrayBuffer();
              const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

              // Convert to MP3
              const mp3File = convertToMp3(audioBuffer);

              const url = URL.createObjectURL(mp3File);
              setAudioURL(url);

              handleInputChange(mp3File, quesId, "audio");
            } catch (conversionError) {
              setError("Failed to convert audio file");
              console.error("Conversion error:", conversionError);
            }
          }

          // Stop and clean up media stream
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }

          setIsRecording(false);
          resolve();
        });
      });
    }
  };

  const deleteRecording = () => {
    // Revoke the previous object URL to free up memory
    if (audioURL && typeof window !== "undefined") {
      const urlObject = window.URL || window.webkitURL;
      if (urlObject) {
        try {
          urlObject.revokeObjectURL(audioURL);
        } catch (err) {
          console.error("Failed to revoke object URL:", err);
        }
      }
    }

    setAudioURL(null);

    // For deleteRecording, pass an empty array to match the type signature
    handleInputChange([], quesId, "audio");
  };

  // Render only on client-side
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className="relative flex h-40 w-full flex-col items-center justify-center space-y-6 rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] p-4 text-center">
      <h2 className="text-center text-sm font-medium text-[#3365E3]">
        Record Audio (MP3)
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
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 rounded-lg bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
            >
              <StopCircle className="h-5 w-5" />
              <span>Stop Recording</span>
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
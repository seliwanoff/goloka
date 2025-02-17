"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  //console.log(src)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="relative flex w-80 items-center gap-3 rounded-full bg-[#F2F3F5] p-3 text-white">
      <button
        onClick={togglePlay}
        className="rounded-full bg-blue-600 p-2 text-white hover:bg-gray-600"
      >
        {isPlaying ? (
          <Pause size={20} className="text-white" strokeWidth={3} />
        ) : (
          <Play size={20} strokeWidth={3} />
        )}
      </button>

      <div className="relative flex flex-1 flex-col">
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="absolute w-full cursor-pointer bg-red-600 opacity-0"
          min="0"
          max="100"
        />
        <div className="relative h-2 w-full overflow-hidden rounded-lg bg-gray-600">
          <div
            className="h-full animate-pulse bg-gradient-to-r from-purple-500 to-blue-500"
            style={{
              width: `${progress}%`,
              clipPath:
                "polygon(0% 50%, 10% 20%, 20% 60%, 30% 40%, 40% 70%, 50% 30%, 60% 80%, 70% 20%, 80% 60%, 90% 30%, 100% 50%)",
            }}
          ></div>
        </div>

        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="pointer-events-none flex items-center gap-2 opacity-50">
        <Volume2 size={16} />
      </div>

      <audio ref={audioRef} src={src}></audio>
    </div>
  );
}

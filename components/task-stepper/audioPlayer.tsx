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
console.log(src)
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
    <div className="flex w-80 items-center gap-3  bg-[#F2F3F5] rounded-full p-3 text-white relative">
      <button
        onClick={togglePlay}
        className="rounded-full bg-blue-600 p-2 hover:bg-gray-600 text-white"
      >
        {isPlaying ? <Pause size={20}  className="text-white" variant='bold'/> : <Play size={20} variant='bold'/>}
      </button>

      <div className="flex flex-1 flex-col relative">

        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="absolute w-full opacity-0 cursor-pointer bg-red-600"
          min="0"
          max="100"
        />
        <div className="w-full h-2 bg-gray-600 rounded-lg relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"
            style={{
              width: `${progress}%`,
              clipPath:
                "polygon(0% 50%, 10% 20%, 20% 60%, 30% 40%, 40% 70%, 50% 30%, 60% 80%, 70% 20%, 80% 60%, 90% 30%, 100% 50%)",
            }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-50 pointer-events-none">
        <Volume2 size={16} />
      </div>

      <audio ref={audioRef} src={src}></audio>
    </div>
  );
}

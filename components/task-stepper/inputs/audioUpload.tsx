import React, { useState } from "react";
import { Mic, X, ChevronDown } from "lucide-react";

const extensionIcons: { [key: string]: string } = {
  pdf: "/resource-icons/pdf.jpg",
  doc: "/resource-icons/word.jpg",
  docx: "/resource-icons/word.jpg",
  txt: "/resource-icons/txt.png",
  xls: "/resource-icons/xls.png",
  xlsx: "/resource-icons/xlsx.png",
  png: "/resource-icons/png-file-.png",
  jpeg: "/resource-icons/jpeg.png",
  jpg: "/resource-icons/jpg.png",
  file: "/resource-icons/gallery.png",
};

const MAX_FILE_SIZE_MB = 10;

interface AudioUploadProps {
  file?: File | null; // Optional prop to allow external files
  onFileUpload?: (file: File | null) => void; // Callback when a file is uploaded
}

const timeIntervals = [
  { label: "1 - 2 min", maxDuration: 2 },
  { label: "2 - 5 min", maxDuration: 5 },
  { label: "5 - 10 min", maxDuration: 10 },
];

const AudioUpload: React.FC<AudioUploadProps> = ({
  file: initialFile,
  onFileUpload,
}) => {
  const [audio, setAudio] = useState<File | null>(initialFile || null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(1); // Max duration in minutes
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Control dropdown visibility

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    // File size validation
    if (selectedFile.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      setError(
        `File size is too large. Only files less than ${MAX_FILE_SIZE_MB}MB are allowed.`,
      );
      setAudio(null);
      setProgress(0);
      return;
    }

    // Duration validation
    const audioElement = new Audio(URL.createObjectURL(selectedFile));
    audioElement.onloadedmetadata = () => {
      const durationInMinutes = audioElement.duration / 60;
      if (selectedTime && durationInMinutes > selectedTime) {
        setError(`Audio duration exceeds the selected time interval.`);
        setAudio(null);
        setAudioUrl(null);
        return;
      }

      setError(null);
      setAudio(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile)); // Set audio URL for playback
      simulateUploadProgress();
      onFileUpload?.(selectedFile);
    };
  };

  const simulateUploadProgress = () => {
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
        }
        return Math.min(prev + 10, 100);
      });
    }, 200);
  };

  const removeAudio = () => {
    setAudio(null);
    setAudioUrl(null);
    setProgress(0);
    setError(null);
    onFileUpload?.(null);
  };

  const handleDropdownSelect = (maxDuration: number) => {
    setSelectedTime(maxDuration);
    setDropdownOpen(false);
  };
  const getFileExtension = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    // Check if extension is found and return it, otherwise return an empty string
    return extension && extension !== fileName ? extension : "";
  };

  const getFileIcon = (fileName: string) => {
    const extension = getFileExtension(fileName);
    // If the extension is not found or invalid, return the 'file' icon
    return extensionIcons[extension] || extensionIcons.file;
  };

  return (
    <div className="w-1/2 space-y-4">
      {/* Upload Box */}
      <div className="relative flex items-center space-x-4 rounded-full border-2 border-[#E0E0E0] bg-[#FCFCFC] px-4 py-2">
        <label
          htmlFor="audio-upload"
          className="flex w-full cursor-pointer items-center space-x-3"
        >
          <div className="flex items-center">
            <Mic className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-sm text-gray-500">
            {audio ? audio.name : "Add audio"}
          </span>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleAudioUpload}
            disabled={true} // Disable upload if no time is selected
          />
        </label>

        {/* Custom Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex w-[120px] items-center justify-center rounded-full bg-gray-200 px-3 py-2 font-poppins text-sm outline-none"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {timeIntervals.find(
              (interval) => interval.maxDuration === selectedTime,
            )?.label || "1 min"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 mt-2 w-full rounded-lg bg-white shadow-lg">
              {timeIntervals.map((interval) => (
                <li
                  key={interval.label}
                  onClick={() => handleDropdownSelect(interval.maxDuration)}
                  className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {interval.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* File Progress */}
      {audio && (
        <div className="space-y-2 rounded-lg bg-gray-50 p-4 shadow-sm">
          <div className="flex items-center">
            <p className="truncate font-medium text-gray-700">{audio.name}</p>
            <button
              onClick={removeAudio}
              className="ml-3 rounded-full p-1 text-red-500 hover:bg-red-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-[10px] text-blue-500">{progress}% Done</p>
            <div className="h-1 w-full rounded-full bg-gray-200">
              <div
                className="h-1 rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <audio
              controls
              src={audioUrl}
              className="mt-2 w-full rounded-lg bg-gray-200 p-2"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AudioUpload;

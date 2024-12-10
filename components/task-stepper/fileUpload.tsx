import React, { useState } from "react";
import { FilePlus2, X } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE_MB = 10;

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
};

interface FileUploadProps {
  value: any;
  ref: React.LegacyRef<HTMLInputElement> | undefined;
  onFileUpload?: (file: File | null, base64: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  value,
  ref,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    // File size validation
    if (selectedFile.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      setError(
        `File size is too high, you can only upload files less than ${MAX_FILE_SIZE_MB}MB`,
      );
      setFile(null);
      setProgress(0);
      return;
    }

    setError(null);
    setFile(selectedFile);

    console.log(value, "valuevaluevalue");

    // Simulate upload progress
    const uploadProgress = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadProgress);
          // Convert file to base64 when upload is complete
          convertFileToBase64(selectedFile);
        }
        return Math.min(prev + 10, 100);
      });
    }, 200);
  };

  const convertFileToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFileBase64(base64);

      // Call the onFileUpload callback if provided
      if (onFileUpload) {
        onFileUpload(file, base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setFile(null);
    setFileBase64(null);
    setProgress(0);
    setError(null);

    // Call onFileUpload with null values when file is removed
    if (onFileUpload) {
      onFileUpload(null, null);
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  const getFileIcon = (fileName: string) => {
    const extension = getFileExtension(fileName);
    return extensionIcons[extension] || "/icons/default-file-icon.png";
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Box */}
      <div className="relative flex h-40 items-center justify-center rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] text-center">
        <label
          htmlFor="file-upload"
          className="flex h-full w-full cursor-pointer items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <div className="flex w-fit cursor-pointer flex-col rounded-lg px-4 py-2 text-sm font-medium text-[#3365E3]">
              <div className="mb-2 flex h-8 w-8 items-center justify-center self-center rounded-full border border-dashed border-slate-300 bg-slate-200">
                <FilePlus2 />
              </div>
              <span>Upload new file</span>
            </div>
            <span className="text-xs text-slate-400">
              PNG, JPG, JPEG, DOCS, PDF, CSV. File size should not be more than
              10MB
            </span>
            <input
              ref={ref}
              id="file-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.csv,.txt,.xls,.xlsx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </label>
        {error && (
          <p className="absolute bottom-2 left-0 right-0 px-4 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

      {/* File Progress */}
      {file && (
        <div className="flex items-center rounded-lg bg-gray-50 shadow-sm">
          <div className="relative mr-3 h-10 w-10">
            <Image
              src={getFileIcon(file.name)}
              alt="File icon"
              fill
              className="object-contain"
            />
          </div>

          {/* File Details */}
          <div className="flex-1">
            <p className="truncate font-medium text-gray-700">{file.name}</p>
            <div className="flex items-center space-x-2">
              <p className="text-[10px] text-blue-500">{progress}% Done</p>
              <div className="h-1 w-full rounded-full bg-gray-200">
                <div
                  className="h-1 rounded-full bg-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={removeFile}
            className="ml-3 rounded-full p-1 text-red-500 hover:bg-red-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

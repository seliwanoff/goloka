import React, { useEffect, useState } from "react";
import { FilePlus2, X } from "lucide-react";
import Image from "next/image";

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

interface FileUploadProps {
  value: any;
  type?: string;
  ref: React.LegacyRef<HTMLInputElement> | undefined;
  onFileUpload?: (file: File | null, base64: string | null) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  value,
  ref,
  disabled,
  type,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError(null);
    setFile(selectedFile);

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
    setPreview(null);
  };

  useEffect(() => {
    if (typeof value === "string" && value) {
      // Handle value as S3 URL or a string
      setPreview(value);
    } else if (value && value.base64) {
      setPreview(value.base64);
    }
  }, [value]);

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
              <span>
                {" "}
                {type === "image" ? "Upload cover image" : "Upload new file"}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {type === "image"
                ? "Supported formats: PNG, JPG, JPEG"
                : "Supported formats: DOCS, PDF, CSV"}{" "}
            </span>
            <input
              ref={ref}
              id="file-upload"
              type="file"
              accept={
                type === "image"
                  ? ".png,.jpg,.jpeg,.gif,.webp"
                  : ".pdf,.doc,.docx,.csv,.txt,.xls,.xlsx"
              }
              className="hidden"
              onChange={handleFileUpload}
              disabled={disabled}
            />
          </div>
        </label>
        {error && (
          <p className="absolute bottom-2 left-0 right-0 px-4 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

      {/* File Preview or Progress */}
      {(preview || file) && (
        <div className="flex items-center rounded-lg bg-gray-50 shadow-sm">
          <div className="relative mr-3 h-10 w-10">
            <Image
              src={file ? getFileIcon(file.name) : extensionIcons.file}
              alt="File icon"
              fill
              className="object-contain"
            />
          </div>

          <div className="flex-1">
            <p className="truncate font-medium text-gray-700">
              {file ? file.name : "Uploaded file"}
            </p>
            <div className="flex items-center space-x-2">
              {file ? (
                <>
                  <p className="text-[10px] text-blue-500">{progress}% Done</p>
                  <div className="h-1 w-full rounded-full bg-gray-200">
                    <div
                      className="h-1 rounded-full bg-blue-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <a
                  href={preview || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 underline"
                >
                  View File
                </a>
              )}
            </div>
          </div>

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

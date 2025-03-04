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
  value?: any;
  type?: string;
  ref: React.LegacyRef<HTMLInputElement> | undefined;
  onFileUpload?: (file: File | null, base64: string | null) => void;
  disabled?: boolean;
}

const FileUploadPreview: React.FC<FileUploadProps> = ({
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
  //  console.log(value);
  const convertFileToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFileBase64(base64);
      setPreview(base64); // Set preview to base64

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
    setPreview(null);

    if (onFileUpload) {
      onFileUpload(null, null);
    }
  };

  useEffect(() => {
    if (typeof value === "string" && value) {
      // If value is a URL and ends with an image extension, use it as preview
      if (/\.(png|jpe?g)$/i.test(value)) {
        setPreview(value);
      } else {
        setPreview(null);
      }
    } else if (value && typeof value === "object" && "base64" in value) {
      setPreview(value.base64);
    }
  }, [value]);

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  const getFileIcon = (fileName: string) => {
    const extension = getFileExtension(fileName);
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
                {type === "image" ? "Upload cover image" : "Upload new file"}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {type === "image"
                ? "Supported formats: PNG, JPG, JPEG"
                : "Supported formats: PNG, JPG, JPEG, DOCS, PDF, CSV"}
            </span>
            <input
              ref={ref}
              id="file-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.csv,.txt,.xls,.xlsx"
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
        <div className="flex items-center rounded-lg bg-gray-50 p-2 shadow-sm">
          {preview && type === "image" ? (
            // Image Preview
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              <Image
                src={preview}
                alt="Uploaded file"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            // File Icon
            <div className="relative mr-3 h-10 w-10">
              <Image
                src={file ? getFileIcon(file.name) : extensionIcons.file}
                alt="File icon"
                fill
                className="object-contain"
              />
            </div>
          )}

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

export default FileUploadPreview;

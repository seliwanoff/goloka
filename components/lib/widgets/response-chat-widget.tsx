import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Danger, Send2 } from "iconsax-react";
import profileImg from "@/public/assets/images/chat-user-profile.png";
import { useChatMessages } from "@/stores/useChatMessage";
import {
  Check,
  CheckCheck,
  Loader2,
  LoaderCircle,
  Paperclip,
} from "lucide-react";

interface ChatWidgetProps {
  modelType: string;
  modelId: number;
  currentUserId: number;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  modelType,
  modelId,
  currentUserId,
}) => {
  const [message, setMessage] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage } = useChatMessages({
    model_type: modelType,
    model_id: modelId,
  });

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() || imageFiles.length > 0) {
      sendMessage(message.trim() || undefined, imageFiles, currentUserId);
      setMessage("");
      setImageFiles([]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // const renderMessageStatus = (msg: any) => {
  //   switch (msg.status) {
  //     case "sending":
  //       return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
  //     case "sent":
  //       return (
  //         <div className="flex">
  //           <Check className="h-3 w-3 text-blue-500" />
  //           <Check className="-ml-1.5 h-3 w-3 text-blue-500" />
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const renderMessageStatus = (msg: any) => {
    switch (msg.__temp_status) {
      case "sending":
        return <LoaderCircle className="h-3 w-3 animate-spin text-gray-400" />;
      // return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
      case "success":
        return (
          <div className="flex">
            <CheckCheck />
          </div>
        );
      case "error":
        return (
          <span className="">
            <Danger size="20" color="#ff2a2a" />
          </span>
        );
      default:
        return null;
    }
  };

  // Sort messages to show most recent at the bottom
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  if (isLoading)
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="animate-spin text-main-100" />
        <p>Loading messages...</p>
      </div>
    );

  if (error) return <div>Error loading messages</div>;

  return (
    <>
      {/* Add overflow-y-auto and max-h to enable scrolling */}
      <div className="flex max-h-[calc(100vh-200px)] w-full flex-col space-y-8 overflow-y-auto p-4 pb-20 md:self-stretch md:pb-4">
        {sortedMessages.map((msg) => (
          <div
            key={msg.local_id || msg.id}
            className={`flex ${
              msg.sender_id === currentUserId
                ? "items-end justify-start gap-4"
                : "justify-end"
            }`}
          >
            {msg.sender_id === currentUserId && (
              <Image
                src={profileImg}
                alt="chat-user"
                className="h-12 w-12 rounded-full object-cover object-center"
              />
            )}
            <div
              className={`max-w-xs rounded-2xl p-4 ${
                msg.sender_id === currentUserId
                  ? "bg-[#3365E3]" // White background for sent messages
                  : "bg-[#F5F5F5]" // Red background for received messages
              }`}
            >
              {msg.message && <p className="text-black">{msg.message}</p>}

              {/* Attached files section */}
              {msg.image_paths && msg.image_paths.length > 0 && (
                <div className={`mt-2 ${msg.message ? "border-t pt-2" : ""}`}>
                  {msg.image_paths.map((imageUrl, index) => {
                    const fileName =
                      typeof imageUrl === "string"
                        ? imageUrl.split("/").pop()
                        : (imageUrl as any)?.name || `Image ${index + 1}`;

                    return (
                      <div key={index} className="mb-1 flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <span className="max-w-[200px] truncate text-sm">
                          {fileName}
                        </span>
                      </div>
                    );
                  })}

                  {msg.image_paths.map((imageUrl, index) => {
                    const src =
                      typeof imageUrl === "string"
                        ? imageUrl
                        : URL.createObjectURL(imageUrl as File);

                    return (
                      <Image
                        key={index}
                        src={src}
                        alt={`Attached image ${index + 1}`}
                        width={200}
                        height={200}
                        className="mt-2 rounded-lg"
                      />
                    );
                  })}
                </div>
              )}

              <div className="mt-1 flex items-center justify-between">
                <span
                  className={`text-xs ${
                    msg.sender_id === currentUserId
                      ? "inline-block w-full text-left text-[#fff]"
                      : "inline-block w-full text-right text-[#9A96A4]"
                  }}`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            {msg.sender_id !== currentUserId && renderMessageStatus(msg)}
          </div>
        ))}
        {/* Ref to scroll to the bottom of messages */}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="absolute bottom-0 left-0 w-full border-t md:flex-row md:justify-start md:p-4"
      >
        <div className="flex w-full items-center gap-6">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            📎
          </label>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Input your message"
            className="form-input h-[50px] flex-1 rounded-full border border-[#DAD8DF] bg-[#F5F5F5] focus:ring-main-100 focus:ring-offset-0 focus-visible:outline-none"
          />
          <button
            type="submit"
            className="flex h-[50px] items-center gap-2 rounded-full bg-main-100 px-5 font-medium text-white"
          >
            <Send2 size="24" />
            Send
          </button>
        </div>
        {imageFiles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {imageFiles.map((file, index) => (
              <div
                key={index}
                className="flex w-fit items-center rounded-xl bg-blue-400 p-1 text-[#fff]"
              >
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setImageFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </form>
    </>
  );
};

export default ChatWidget;

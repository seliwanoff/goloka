import { ServerResponse } from "http";
import { Chat, ChatParams, CreateChatParams } from "./types";
import { fetchData, postDataWithFormData } from "@/lib/api";

export const getChatMessages = async (
  params: ChatParams,
  //@ts-ignore
): Promise<ServerResponse<Chat[]>> => {
  try {
    const query = new URLSearchParams({
      model_type: params.model_type,
      model_id: params.model_id.toString(),
    });

    const endpoint = `/chats?${query.toString()}`;
    //@ts-ignore
    return await fetchData<ServerResponse<Chat[]>>(endpoint);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw new Error("Failed to fetch chat messages. Please try again later.");
  }
};

export const createChatMessage = async (
  data: CreateChatParams,
  //@ts-ignore
): Promise<ServerResponse<Chat>> => {
  try {
    const formData = new FormData();

    // Only append message if it exists
    if (data.message) {
      formData.append("message", data.message);
    }

    formData.append("model_type", data.model_type);
    formData.append("model_id", data.model_id.toString());

    // Handle multiple image uploads
    if (data.image_paths && data.image_paths.length > 0) {
      data.image_paths.forEach((file, index) => {
        // If it's a File object, append it directly
        if (file instanceof File) {
          formData.append(`image_paths[${index}]`, file);
        }
        // If it's a string (URL), you might want to handle it differently
        // depending on your backend requirements
        else if (typeof file === "string") {
          formData.append(`image_paths[${index}]`, file);
        }
      });
    }
    //@ts-ignore
    return await postDataWithFormData<ServerResponse<Chat>>(
      "/chats/create",
      formData,
    );
  } catch (error) {
    console.error("Error creating chat message:", error);
    throw new Error("Failed to send chat message. Please try again later.");
  }
};

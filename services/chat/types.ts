// types/chat.ts
// services/chat/types.ts
export type MessageStatus = "sending" | "sent" | "failed";

export interface Chat {
  id?: number;
  message?: string;
  sender_id: number;
  receiver_id: number;
  model_type: string;
  model_id: number;
  image_paths?: (string | File)[];
  created_at: string;
  updated_at: string;
  status?: MessageStatus;
  local_id?: string;
}

export interface CreateChatParams {
  message?: string;
  model_type: string;
  model_id: number;
  image_paths?: File[];
  local_id?: string;
  sender_id?: number;
}

export interface ChatParams {
  model_type: string;
  model_id: number;
  currentUserId?: number;
}

// export interface CreateChatParams {
//   message: string;
//   model_type: string;
//   model_id: number;
//   image?: File | null;
// }

export interface ServerResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

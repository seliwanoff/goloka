// hooks/useChatMessages.ts
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createChatMessage, getChatMessages } from "@/services/chat";
import {
  Chat,
  ChatParams,
  CreateChatParams,
  MessageStatus,
} from "@/services/chat/types";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "./currentUserStore";

export const useChatMessages = (params: ChatParams) => {
  const currentUser = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Chat[]>([]);

  // Fetch chat messages
  const { data, isLoading, error } = useQuery({
    queryKey: ["chatMessages", params.model_type, params.model_id],
    queryFn: () => getChatMessages(params),
    enabled: !!params.model_type && !!params.model_id,
  });
  console.log({ data });
  // Create chat message mutation
  // const createMessageMutation = useMutation({
  //   mutationFn: (chatData: CreateChatParams) => createChatMessage(chatData),
  //   onMutate: async (newMessage) => {
  //     // Cancel any outgoing refetches
  //     await queryClient.cancelQueries({
  //       queryKey: ["chatMessages", params.model_type, params.model_id],
  //     });

  //     // Snapshot the previous value
  //     const previousMessages = queryClient.getQueryData<{ data: Chat[] }>([
  //       "chatMessages",
  //       params.model_type,
  //       params.model_id,
  //     ]);

  //     // Optimistically add the new message
  //     queryClient.setQueryData(
  //       ["chatMessages", params.model_type, params.model_id],
  //       (old: { data: Chat[] } | undefined) => ({
  //         data: [
  //           ...(old?.data || []),
  //           {
  //             ...newMessage,
  //             id: undefined,
  //             status: "sending" as MessageStatus,
  //             local_id: newMessage.local_id,
  //             sender_id: currentUser?.id, // Assuming current user
  //             created_at: new Date().toISOString(),
  //           },
  //         ],
  //       }),
  //     );

  //     // Return a context object with the snapshotted value
  //     return { previousMessages };
  //   },
  //   onSuccess: (response, variables, context) => {
  //     // Update the message with server response
  //     queryClient.setQueryData(
  //       ["chatMessages", params.model_type, params.model_id],
  //       (old: { data: Chat[] } | undefined) => ({
  //         data: (old?.data || []).map((msg) =>
  //           msg.local_id === variables.local_id
  //             ? {
  //                 //@ts-ignore
  //                 ...response.data,
  //                 status: "sent" as MessageStatus,
  //               }
  //             : msg,
  //         ),
  //       }),
  //     );
  //   },
  //   onError: (error, variables, context) => {
  //     // Revert to the previous state or mark message as failed
  //     queryClient.setQueryData(
  //       ["chatMessages", params.model_type, params.model_id],
  //       (old: { data: Chat[] } | undefined) => ({
  //         data: (old?.data || []).map((msg) =>
  //           msg.local_id === variables.local_id
  //             ? {
  //                 ...msg,
  //                 status: "failed" as MessageStatus,
  //               }
  //             : msg,
  //         ),
  //       }),
  //     );
  //   },
  // });
const createMessageMutation = useMutation({
  mutationFn: (chatData: CreateChatParams) => createChatMessage(chatData),
  onMutate: async (newMessage) => {
    await queryClient.cancelQueries({
      queryKey: ["chatMessages", params.model_type, params.model_id],
    });

    const previousMessages = queryClient.getQueryData<{ data: Chat[] }>([
      "chatMessages",
      params.model_type,
      params.model_id,
    ]);

    queryClient.setQueryData(
      ["chatMessages", params.model_type, params.model_id],
      (old: { data: Chat[] } | undefined) => ({
        data: [
          ...(old?.data || []),
          {
            ...newMessage,
            id: undefined,
            local_id: newMessage.local_id,
             sender_id: currentUser?.id,
            created_at: new Date().toISOString(),
            // Add a temporary status for visual feedback
            __temp_status: "sending",
          },
        ],
      }),
    );

    return { previousMessages };
  },
  onSuccess: (response, variables, context) => {
    queryClient.setQueryData(
      ["chatMessages", params.model_type, params.model_id],
      (old: { data: Chat[] } | undefined) => ({
        data: (old?.data || []).map((msg) =>
          msg.local_id === variables.local_id
            ? {
                //@ts-ignore
                ...response.data,
                __temp_status: "success",
              }
            : msg,
        ),
      }),
    );
  },
  onError: (error, variables, context) => {
    queryClient.setQueryData(
      ["chatMessages", params.model_type, params.model_id],
      (old: { data: Chat[] } | undefined) => ({
        data: (old?.data || []).map((msg) =>
          msg.local_id === variables.local_id
            ? {
                ...msg,
                __temp_status: "error",
              }
            : msg,
        ),
      }),
    );
  },
});
  useEffect(() => {
    //@ts-ignore
    if (data?.data) {
      //@ts-ignore
      setMessages(data.data);
    }
  }, [data]);

  const sendMessage = (
    message?: string,
    imageFiles?: File[] | null,
    currentUserId?: number,
  ) => {
    const local_id = uuidv4();

    // Only send if there's a message or image files
    // if (message || (imageFiles && imageFiles.length > 0)) {
    //   createMessageMutation.mutate({
    //     message,
    //     model_type: params.model_type,
    //     model_id: params.model_id,
    //     image_paths: imageFiles || undefined,
    //     local_id,
    //   });
    // }
    // Only send if there's a message or image files
    if (message || (imageFiles && imageFiles.length > 0)) {
      createMessageMutation.mutate({
        message,
        model_type: params.model_type,
        model_id: params.model_id, // Keep original model_id
        sender_id: currentUserId, // Explicitly set sender_id
        image_paths: imageFiles || undefined,
        local_id,
      });
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};

import { useSocket } from "@/context/SocketContext";
import { WHATSAPP_QUERY_KEYS, normalizeLegacyMessage } from "@/utils/whatsapp/formatters";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const SOCKET_EVENTS = [
  "newMessage",
  "whatsapp:message",
  "whatsapp:message:created",
  "whatsapp:message:status",
  "whatsapp:conversation:updated",
  "messageStatus",
];

const appendMessage = (data, message) => {
  if (!data?.pages?.length) return data;

  const pages = [...data.pages];
  const lastIndex = pages.length - 1;
  const exists = pages.some((page) =>
    (page.items ?? []).some((item) => item.id === message.id)
  );

  if (exists) return data;

  pages[lastIndex] = {
    ...pages[lastIndex],
    items: [...(pages[lastIndex].items ?? []), message],
  };

  return { ...data, pages };
};

export const useWhatsappSocketEvents = (activeConversationId) => {
  const { socket } = useSocket() || {};
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return undefined;

    const handleEvent = (eventPayload = {}) => {
      const payload = eventPayload.data ?? eventPayload;
      const conversationId =
        payload.conversationId || payload.chatId || payload.waId || payload.from;

      queryClient.invalidateQueries({ queryKey: ["whatsapp", "conversations"] });
      queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEYS.overview });

      if (!conversationId) return;

      if (payload.message || payload.messageBody || payload.content) {
        const normalized = normalizeLegacyMessage({
          ...payload.message,
          ...payload,
          conversationId,
        });

        queryClient.setQueryData(
          WHATSAPP_QUERY_KEYS.messages(conversationId),
          (current) => appendMessage(current, normalized)
        );
      }

      if (activeConversationId === conversationId) {
        queryClient.invalidateQueries({
          queryKey: WHATSAPP_QUERY_KEYS.messages(conversationId),
        });
      }
    };

    SOCKET_EVENTS.forEach((eventName) => socket.on(eventName, handleEvent));

    return () => {
      SOCKET_EVENTS.forEach((eventName) => socket.off(eventName, handleEvent));
    };
  }, [activeConversationId, queryClient, socket]);
};

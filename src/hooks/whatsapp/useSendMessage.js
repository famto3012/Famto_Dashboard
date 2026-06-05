import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { whatsappApi } from "@/api/whatsapp/whatsappApi";
import { WHATSAPP_QUERY_KEYS } from "@/utils/whatsapp/formatters";

const appendMessageToInfiniteData = (data, message) => {
  if (!data?.pages?.length) {
    return {
      pages: [{ items: [message], nextPage: null, total: 1 }],
      pageParams: [1],
    };
  }

  const pages = [...data.pages];
  const lastIndex = pages.length - 1;

  pages[lastIndex] = {
    ...pages[lastIndex],
    items: [...(pages[lastIndex].items ?? []), message],
  };

  return { ...data, pages };
};

export const useSendWhatsappMessage = (conversationId) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      whatsappApi.sendMessage(navigate, conversationId, payload),
    onMutate: async (payload) => {
      const queryKey = WHATSAPP_QUERY_KEYS.messages(conversationId);
      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData(queryKey);
      const optimisticMessage = {
        id: `optimistic-${Date.now()}`,
        conversationId,
        direction: "outbound",
        type: payload.messageType || payload.type || "text",
        content: payload.content || "",
        createdAt: new Date().toISOString(),
        status: "sending",
        media: payload.file
          ? {
              url: URL.createObjectURL(payload.file),
              mimeType: payload.file.type,
              fileName: payload.file.name,
              size: payload.file.size,
            }
          : null,
        template: payload.template || null,
      };

      queryClient.setQueryData(queryKey, (current) =>
        appendMessageToInfiniteData(current, optimisticMessage)
      );

      return { previousMessages };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          WHATSAPP_QUERY_KEYS.messages(conversationId),
          context.previousMessages
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: WHATSAPP_QUERY_KEYS.messages(conversationId),
      });
      queryClient.invalidateQueries({ queryKey: ["whatsapp", "conversations"] });
      queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEYS.overview });
    },
  });
};

export const useSendWhatsappTemplate = (conversationId) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      whatsappApi.sendTemplate(navigate, conversationId, payload),
    onSuccess: (message) => {
      queryClient.setQueryData(
        WHATSAPP_QUERY_KEYS.messages(conversationId),
        (current) => appendMessageToInfiniteData(current, message)
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: WHATSAPP_QUERY_KEYS.messages(conversationId),
      });
      queryClient.invalidateQueries({ queryKey: ["whatsapp", "conversations"] });
    },
  });
};

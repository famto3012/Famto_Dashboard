import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { whatsappApi } from "@/api/whatsapp/whatsappApi";
import {
  WHATSAPP_QUERY_KEYS,
  normalizeLegacyConversation,
  normalizeLegacyMessage,
} from "@/utils/whatsapp/formatters";

export const fetchAllWhatsappConversation = async (navigate) => {
  const conversations = await whatsappApi.legacyConversations(navigate);
  return conversations.map(normalizeLegacyConversation);
};

export const fetchAllWhatsappMessagesById = async (waId, navigate) => {
  const messages = await whatsappApi.legacyMessages(navigate, waId);
  return messages.map(normalizeLegacyMessage);
};

export const sendWhatsappMessage = async (data, navigate) => {
  const conversationId =
    data?.get?.("conversationId") || data?.conversationId || data?.get?.("to");

  return whatsappApi.sendMessage(navigate, conversationId, data);
};

export const useWhatsappOverview = () => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.overview,
    queryFn: () => whatsappApi.overview(navigate),
    staleTime: 60 * 1000,
  });
};

export const useWhatsappMeta = () => ({
  agents: whatsappApi.agents(),
  tags: whatsappApi.tags(),
});

export const useWhatsappConversationActions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const invalidateConversationData = () => {
    queryClient.invalidateQueries({ queryKey: ["whatsapp", "conversations"] });
    queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEYS.overview });
  };

  const updateConversation = useMutation({
    mutationFn: ({ conversationId, payload }) =>
      whatsappApi.updateConversation(navigate, conversationId, payload),
    onSuccess: invalidateConversationData,
  });

  const addNote = useMutation({
    mutationFn: ({ conversationId, payload }) =>
      whatsappApi.addNote(navigate, conversationId, payload),
    onSuccess: (_, variables) => {
      invalidateConversationData();
      queryClient.invalidateQueries({
        queryKey: WHATSAPP_QUERY_KEYS.messages(variables.conversationId),
      });
    },
  });

  return {
    updateConversation,
    addNote,
  };
};

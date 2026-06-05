import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { whatsappApi } from "@/api/whatsapp/whatsappApi";
import {
  WHATSAPP_QUERY_KEYS,
  flattenInfiniteData,
  normalizeLegacyConversation,
} from "@/utils/whatsapp/formatters";

const DEFAULT_FILTERS = {
  search: "",
  status: "all",
  tag: "all",
  assignee: "all",
};

export const useWhatsappConversations = (filters = DEFAULT_FILTERS) => {
  const navigate = useNavigate();
  const stableFilters = {
    ...DEFAULT_FILTERS,
    ...filters,
  };

  return useInfiniteQuery({
    queryKey: WHATSAPP_QUERY_KEYS.conversations(stableFilters),
    queryFn: ({ pageParam = 1 }) =>
      whatsappApi.conversations(navigate, {
        ...stableFilters,
        page: pageParam,
        limit: 20,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    staleTime: 20 * 1000,
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: (page.items ?? []).map(normalizeLegacyConversation),
      })),
    }),
  });
};

export const useFlattenedConversations = (queryResult) =>
  useMemo(() => flattenInfiniteData(queryResult?.data), [queryResult?.data]);

export const useSelectedConversation = (conversations = [], selectedId) =>
  useMemo(
    () =>
      conversations.find(
        (conversation) =>
          conversation.id === selectedId || conversation.waId === selectedId
      ) || null,
    [conversations, selectedId]
  );

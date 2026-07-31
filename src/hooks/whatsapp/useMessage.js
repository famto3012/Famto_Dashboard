import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { whatsappApi } from "@/api/whatsapp/whatsappApi";
import {
  WHATSAPP_QUERY_KEYS,
  flattenInfiniteData,
  normalizeLegacyMessage,
} from "@/utils/whatsapp/formatters";

export const useWhatsappMessages = (conversationId) => {
  const navigate = useNavigate();

  return useInfiniteQuery({
    queryKey: WHATSAPP_QUERY_KEYS.messages(conversationId),
    queryFn: ({ pageParam = 1 }) =>
      whatsappApi.messages(navigate, conversationId, {
        page: pageParam,
        limit: 25,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    enabled: Boolean(conversationId),
    staleTime: 15 * 1000,
    select: (data) => ({
      ...data,
      pages: data.pages
        .slice()
        .reverse()
        .map((page) => ({
          ...page,
          items: (page.items ?? []).map(normalizeLegacyMessage),
        })),
    }),
  });
};

export const useFlattenedMessages = (queryResult) =>
  useMemo(() => flattenInfiniteData(queryResult?.data), [queryResult?.data]);

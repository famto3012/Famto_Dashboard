/* eslint-disable react/prop-types */
import ConversationItem from "./ConversationItem";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import { useFlattenedConversations, useWhatsappConversations } from "@/hooks/whatsapp/useConversation";
import { InboxIcon } from "@heroicons/react/24/outline";

const ConversationList = ({ filters, selectedId, onSelect }) => {
  const query = useWhatsappConversations(filters);
  const conversations = useFlattenedConversations(query);

  if (query.isLoading) {
    return (
      <div className="p-3">
        <LoadingRows count={7} />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="p-3">
        <ErrorState
          title="Chats could not be loaded"
          message={query.error?.message}
          onRetry={query.refetch}
        />
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <EmptyState
        icon={InboxIcon}
        title="No conversations found"
        description="Try clearing filters or search for a customer by phone number."
      />
    );
  }

  return (
    <div className="space-y-2 p-3">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          active={selectedId === conversation.id || selectedId === conversation.waId}
          onSelect={onSelect}
        />
      ))}

      {query.hasNextPage && (
        <button
          type="button"
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {query.isFetchingNextPage ? "Loading more..." : "Load more conversations"}
        </button>
      )}
    </div>
  );
};

export default ConversationList;

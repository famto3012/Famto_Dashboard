/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import ChatHeader from "../layouts/ChatHeader";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import DateSeparator from "./DataSeparator";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { useFlattenedMessages, useWhatsappMessages } from "@/hooks/whatsapp/useMessage";
import { groupMessagesByDate } from "@/utils/whatsapp/formatters";

const MessagesContainer = ({ conversation, onBack }) => {
  const [templatePanelOpen, setTemplatePanelOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const query = useWhatsappMessages(conversation?.id);
  const messages = useFlattenedMessages(query);

  const groups = useMemo(() => groupMessagesByDate(messages), [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [conversation?.id, messages.length]);

  if (!conversation) {
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <EmptyState
          icon={ChatBubbleOvalLeftEllipsisIcon}
          title="Select a conversation"
          description="Open a WhatsApp chat to reply, send templates, add notes, and view order context."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <ChatHeader
        conversation={conversation}
        onBack={onBack}
        onOpenTemplates={() => setTemplatePanelOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_#ecfdf5_0,_#f8fafc_34%,_#f1f5f9_100%)] p-4 wa-scrollbar">
        {query.isLoading ? (
          <div className="mx-auto max-w-3xl space-y-4">
            <LoadingRows count={6} />
          </div>
        ) : query.isError ? (
          <ErrorState
            title="Messages could not be loaded"
            message={query.error?.message}
            onRetry={query.refetch}
          />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {query.hasNextPage && (
              <button
                type="button"
                onClick={() => query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
                className="mx-auto rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {query.isFetchingNextPage ? "Loading..." : "Load older messages"}
              </button>
            )}

            {Object.entries(groups).map(([dateLabel, groupMessages]) => (
              <div key={dateLabel} className="space-y-3">
                <DateSeparator label={dateLabel} />
                {groupMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            ))}

            {conversation.typing && <TypingIndicator name={conversation.name} />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput
        conversation={conversation}
        templatePanelOpen={templatePanelOpen}
        setTemplatePanelOpen={setTemplatePanelOpen}
      />
    </div>
  );
};

export default MessagesContainer;

/* eslint-disable react/prop-types */
import {
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";
import { formatMessageTime, getRelativeTime } from "@/utils/whatsapp/formatters";

const tagTone = {
  vip: "emerald",
  "order-issue": "rose",
  cod: "amber",
  "new-lead": "sky",
  campaign: "violet",
};

const ConversationItem = ({ conversation, active, onSelect }) => {
  const hasMedia = conversation.lastMessageType && conversation.lastMessageType !== "text";

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`w-full rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        active
          ? "border-emerald-200 bg-emerald-50 shadow-sm"
          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex gap-3">
        <Avatar name={conversation.name} src={conversation.avatar} online={conversation.isOnline} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-950">
                {conversation.name}
              </h3>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {conversation.phone}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[11px] font-medium text-slate-400">
                {formatMessageTime(conversation.lastMessageAt)}
              </p>
              {conversation.unreadCount > 0 && (
                <span className="mt-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            {hasMedia ? (
              <PaperClipIcon className="h-4 w-4 shrink-0 text-slate-400" />
            ) : (
              <ChatBubbleLeftEllipsisIcon className="h-4 w-4 shrink-0 text-slate-400" />
            )}
            <p className="truncate">{conversation.lastMessage || "Media message"}</p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {conversation.tags?.slice(0, 2).map((tag) => (
              <StatusBadge key={tag} tone={tagTone[tag] || "slate"} size="xs">
                {tag.replace("-", " ")}
              </StatusBadge>
            ))}
            {conversation.campaignStatus && (
              <StatusBadge size="xs">{conversation.campaignStatus}</StatusBadge>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="truncate">
              {conversation.assignedTo?.name || "Unassigned"}
            </span>
            <span className="inline-flex items-center gap-1">
              {conversation.status === "resolved" ? (
                <CheckCircleIcon className="h-3.5 w-3.5" />
              ) : (
                <ClockIcon className="h-3.5 w-3.5" />
              )}
              {getRelativeTime(conversation.lastMessageAt)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;

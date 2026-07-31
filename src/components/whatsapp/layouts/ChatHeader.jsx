/* eslint-disable react/prop-types */
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  SparklesIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";
import { formatPhone, getRelativeTime } from "@/utils/whatsapp/formatters";

const ChatHeader = ({ conversation, onBack, onOpenTemplates }) => {
  if (!conversation) return null;

  return (
    <header className="flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        <Avatar
          name={conversation.name}
          src={conversation.avatar}
          online={conversation.isOnline}
          size="lg"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-slate-950">
              {conversation.name}
            </h2>
            <StatusBadge size="xs" dot>
              {conversation.status}
            </StatusBadge>
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            {conversation.phone || formatPhone(conversation.waId)} · session {conversation.sessionExpiresAt ? getRelativeTime(conversation.sessionExpiresAt) : "active"}
          </p>
        </div>
      </div>

      {/* <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenTemplates}
          className="hidden items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:flex"
        >
          <SparklesIcon className="h-4 w-4" />
          Template
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          title="Call customer"
        >
          <PhoneIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 sm:flex"
          title="Assign conversation"
        >
          <UserPlusIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 sm:flex"
          title="Mark resolved"
        >
          <CheckCircleIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100"
          title="More actions"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      </div> */}
    </header>
  );
};

export default ChatHeader;

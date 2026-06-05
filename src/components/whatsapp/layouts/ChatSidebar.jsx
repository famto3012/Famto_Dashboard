/* eslint-disable react/prop-types */
import { PlusIcon, QueueListIcon } from "@heroicons/react/24/outline";
import ConversationList from "../conversations/ConversationList";
import SearchBar from "../conversations/SearchBar";
import ChatFilters from "../conversations/ChatFilters";
import { useWhatsappOverview } from "@/hooks/whatsapp/useWhatsapp";

const ChatSidebar = ({ filters, setFilters, selectedId, onSelect }) => {
  const overview = useWhatsappOverview();
  const inbox = overview.data?.inbox;

  return (
    <aside className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <QueueListIcon className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-950">
                WhatsApp Inbox
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {inbox?.open ?? 0} open chats, {inbox?.unread ?? 0} unread
            </p>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700"
            title="Start new chat"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters((current) => ({ ...current, search }))}
          />
        </div>

        <div className="mt-3">
          <ChatFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto wa-scrollbar">
        <ConversationList
          filters={filters}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </aside>
  );
};

export default ChatSidebar;

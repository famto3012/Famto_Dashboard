/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  CurrencyRupeeIcon,
  HashtagIcon,
  PencilSquareIcon,
  ShoppingBagIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { useWhatsappConversationActions, useWhatsappMeta } from "@/hooks/whatsapp/useWhatsapp";
import { formatCurrency, getRelativeTime } from "@/utils/whatsapp/formatters";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-3 py-2">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <span className="truncate text-sm font-semibold text-slate-800">{value}</span>
  </div>
);

const CustomerInfoSidebar = ({ conversation }) => {
  const [note, setNote] = useState("");
  const { tags } = useWhatsappMeta();
  const { updateConversation, addNote } = useWhatsappConversationActions();

  if (!conversation) {
    return (
      <aside className="h-full bg-white">
        <EmptyState
          icon={UserCircleIcon}
          title="Customer details"
          description="Select a conversation to see tags, notes, orders, custom fields, and campaign history."
        />
      </aside>
    );
  }

  const selectedTags = new Set(conversation.tags || []);

  const toggleTag = (tagId) => {
    const nextTags = selectedTags.has(tagId)
      ? conversation.tags.filter((item) => item !== tagId)
      : [...(conversation.tags || []), tagId];

    updateConversation.mutate({
      conversationId: conversation.id,
      payload: { tags: nextTags },
    });
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    addNote.mutate(
      {
        conversationId: conversation.id,
        payload: { content: note.trim(), author: "Support" },
      },
      {
        onSuccess: () => setNote(""),
      }
    );
  };

  const totalSpent = conversation.orderHistory?.reduce(
    (sum, order) => sum + Number(order.total || order.amount || 0),
    0
  );

  return (
    <aside className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-slate-200 p-5 text-center">
        <div className="flex justify-center">
          <Avatar
            name={conversation.name}
            src={conversation.avatar}
            online={conversation.isOnline}
            size="xl"
          />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-slate-950">
          {conversation.name}
        </h2>
        <p className="text-sm text-slate-500">{conversation.phone}</p>
        <div className="mt-3 flex justify-center gap-2">
          <StatusBadge>{conversation.status}</StatusBadge>
          <StatusBadge tone="sky">{conversation.source}</StatusBadge>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 wa-scrollbar">
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <CurrencyRupeeIcon className="h-4 w-4 text-emerald-600" />
            Customer value
          </h3>
          <div className="grid gap-2">
            <InfoRow label="Total spent" value={formatCurrency(totalSpent)} />
            <InfoRow label="Orders" value={conversation.orderHistory?.length || 0} />
            <InfoRow
              label="Last active"
              value={getRelativeTime(conversation.lastMessageAt)}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <TagIcon className="h-4 w-4 text-emerald-600" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedTags.has(tag.id)
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <PencilSquareIcon className="h-4 w-4 text-emerald-600" />
            Notes
          </h3>
          <div className="space-y-2">
            {conversation.notes?.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-sm leading-6 text-slate-700">{item.content}</p>
                <p className="mt-2 text-xs font-medium text-slate-400">
                  {item.author} · {getRelativeTime(item.createdAt)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border border-slate-200 p-2">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Add internal note"
              className="w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleAddNote}
              disabled={addNote.isPending || !note.trim()}
              className="w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addNote.isPending ? "Saving..." : "Save note"}
            </button>
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShoppingBagIcon className="h-4 w-4 text-emerald-600" />
            Order history
          </h3>
          <div className="space-y-2">
            {conversation.orderHistory?.length ? (
              conversation.orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{order.id}</p>
                    <p className="text-xs text-slate-500">{order.status}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">
                No orders linked yet.
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <HashtagIcon className="h-4 w-4 text-emerald-600" />
            Custom fields
          </h3>
          <div className="grid gap-2">
            {Object.entries(conversation.customFields || {}).map(([key, value]) => (
              <InfoRow key={key} label={key} value={value} />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default CustomerInfoSidebar;

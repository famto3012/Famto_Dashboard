/* eslint-disable react/prop-types */
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useWhatsappMeta } from "@/hooks/whatsapp/useWhatsapp";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "pinned", label: "Pinned" },
];

const ChatFilters = ({ filters, onChange }) => {
  const { agents, tags } = useWhatsappMeta();

  const setFilter = (key, value) => onChange((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 wa-scrollbar">
        {statusOptions.map((option) => {
          const active = filters.status === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setFilter("status", option.value)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="relative">
          <FunnelIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.tag}
            onChange={(event) => setFilter("tag", event.target.value)}
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">All tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.label}
              </option>
            ))}
          </select>
        </label>

        <select
          value={filters.assignee}
          onChange={(event) => setFilter("assignee", event.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="all">All agents</option>
          <option value="unassigned">Unassigned</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChatFilters;

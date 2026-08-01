import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useWhatsappCampaignEvents } from "@/hooks/whatsapp/useWhatsappResources";
import { formatCompactNumber, getRelativeTime, formatMessageTime } from "@/utils/whatsapp/formatters";

const STATUS_TONE = {
  sent: "bg-blue-50 text-blue-700",
  delivered: "bg-emerald-50 text-emerald-700",
  read: "bg-violet-50 text-violet-700",
  failed: "bg-red-50 text-red-700",
};

const CampaignDetailsDrawer = ({ campaign, onClose }) => {
  const eventsQuery = useWhatsappCampaignEvents(campaign?.id, !!campaign);
  const [search, setSearch] = useState("");

  const events = useMemo(() => eventsQuery.data?.events ?? [], [eventsQuery.data]);
  const stats = eventsQuery.data?.stats ?? campaign?.stats ?? {};

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      (e.waId || "").toLowerCase().includes(q) ||
      (e.status || "").toLowerCase().includes(q) ||
      (e.failureReason || "").toLowerCase().includes(q)
    );
  }, [events, search]);

  if (!campaign) return null;

  const funnel = [
    { label: "Sent", value: stats.sent, tone: "bg-blue-600" },
    { label: "Delivered", value: stats.delivered, tone: "bg-emerald-600" },
    { label: "Read", value: stats.read, tone: "bg-violet-600" },
    { label: "Failed", value: stats.failed, tone: "bg-red-600" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-4xl flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">{campaign.name}</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {campaign.templateName} · {campaign.audience} · {getRelativeTime(campaign.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close campaign details"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Funnel summary */}
        <div className="grid grid-cols-4 gap-3 border-b border-slate-100 px-6 py-4">
          {funnel.map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 p-3">
              <div className={`mb-1.5 h-1 w-6 rounded-full ${item.tone}`} />
              <p className="text-lg font-bold text-slate-950">{formatCompactNumber(item.value)}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Recipients */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="mb-3 flex items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${events.length} recipients by number, status, or reason…`}
              className="h-10 w-full max-w-sm rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
            <span className="text-xs text-slate-400">
              {filteredEvents.length} / {events.length}
            </span>
          </div>
          {eventsQuery.isLoading ? (
            <p className="py-8 text-center text-sm text-slate-400">Loading recipients…</p>
          ) : eventsQuery.isError ? (
            <p className="py-8 text-center text-sm text-red-500">Failed to load recipient details.</p>
          ) : events.length ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 font-semibold">Recipient</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Detail</th>
                  <th className="pb-2 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((event, i) => (
                  <tr key={event.metaMessageId || i} className="align-top">
                    <td className="py-2.5 font-medium text-slate-800">{event.waId}</td>
                    <td className="py-2.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_TONE[event.status] || "bg-slate-100 text-slate-600"}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-xs text-slate-500">
                      {event.failureReason || (event.metaMessageId ? "Meta ID: " + event.metaMessageId : "—")}
                    </td>
                    <td className="py-2.5 text-xs text-slate-400">
                      {event.timestamp ? formatMessageTime(event.timestamp) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              {search ? "No recipients match your search." : "No recipient events yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsDrawer;

CampaignDetailsDrawer.propTypes = {
  campaign: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    templateName: PropTypes.string,
    audience: PropTypes.string,
    createdAt: PropTypes.string,
    stats: PropTypes.object,
  }),
  onClose: PropTypes.func.isRequired,
};

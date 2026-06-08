import { useEffect, useMemo, useState } from "react";
import {
  CalendarDaysIcon,
  MegaphoneIcon,
  PaperAirplaneIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import SectionPanel from "../common/SectionPanel";
import StatCard from "../common/StatCard";
import StatusBadge from "../common/StatusBadge";
import { useCreateWhatsappCampaign, useSendWhatsappCampaign, useWhatsappCampaigns, useWhatsappTemplates } from "@/hooks/whatsapp/useWhatsappResources";
import { formatCompactNumber, formatCurrency, getRelativeTime } from "@/utils/whatsapp/formatters";
import createApiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";

const AUDIENCE_OPTIONS = [
  "All opted-in customers",
  "VIP customers",
  "Inactive customers",
  "Delayed orders",
  "CSV import segment",
];

const CampaignsPage = () => {
  const navigate = useNavigate();
  const campaignsQuery = useWhatsappCampaigns();
  const templatesQuery = useWhatsappTemplates();
  const createCampaign = useCreateWhatsappCampaign();
  const sendCampaign = useSendWhatsappCampaign();
  const [form, setForm] = useState({
    name: "",
    templateId: "",
    audience: "All opted-in customers",
    scheduleAt: "",
    sendNow: false,
  });
  const [audienceCount, setAudienceCount] = useState(null);
  const [audienceLoading, setAudienceLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch contact count whenever audience changes
  useEffect(() => {
    let cancelled = false;
    setAudienceCount(null);
    setAudienceLoading(true);
    const api = createApiClient(navigate);
    api.get("/whatsapp/campaigns/audience-preview", { params: { audience: form.audience } })
      .then((r) => {
        if (!cancelled) setAudienceCount(r?.data?.data?.count ?? 0);
      })
      .catch(() => { if (!cancelled) setAudienceCount(null); })
      .finally(() => { if (!cancelled) setAudienceLoading(false); });
    return () => { cancelled = true; };
  }, [form.audience]);

  const campaigns = useMemo(() => campaignsQuery.data ?? [], [campaignsQuery.data]);
  const stats = useMemo(
    () => campaigns.reduce(
      (totals, campaign) => ({
        sent: totals.sent + Number(campaign.sent || 0),
        delivered: totals.delivered + Number(campaign.delivered || 0),
        replies: totals.replies + Number(campaign.replied || 0),
        spend: totals.spend + Number(campaign.spend || 0),
      }),
      { sent: 0, delivered: 0, replies: 0, spend: 0 }
    ),
    [campaigns]
  );

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setCreateError("");

    if (!form.name || !form.templateId) return;
    if (audienceCount === 0) {
      setCreateError("No contacts found for this audience. Add contacts first.");
      return;
    }

    createCampaign.mutate(
      {
        name: form.name,
        templateId: form.templateId,
        audience: form.audience,
        scheduledAt: form.sendNow ? null : (form.scheduleAt || null),
        sendNow: form.sendNow,
      },
      {
        onSuccess: (data) => {
          setForm({ name: "", templateId: "", audience: "All opted-in customers", scheduleAt: "", sendNow: false });
          setCreateError("");
          setSuccessMsg(data?.message || "Campaign created successfully");
          setTimeout(() => setSuccessMsg(""), 5000);
        },
        onError: (err) => {
          setCreateError(err?.response?.data?.message || err?.message || "Failed to create campaign");
        },
      }
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Messages sent" value={formatCompactNumber(stats.sent)} icon={PaperAirplaneIcon} />
        <StatCard label="Delivered" value={`${stats.sent ? Math.round((stats.delivered / stats.sent) * 100) : 0}%`} icon={MegaphoneIcon} tone="sky" />
        <StatCard label="Replies" value={formatCompactNumber(stats.replies)} icon={UsersIcon} tone="violet" />
        <StatCard label="Campaign spend" value={formatCurrency(stats.spend)} icon={CalendarDaysIcon} tone="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <SectionPanel
          title="Broadcast campaigns"
          description="Track WhatsApp marketing, utility, and lifecycle campaigns."
        >
          {campaignsQuery.isLoading ? (
            <LoadingRows count={5} />
          ) : campaignsQuery.isError ? (
            <ErrorState message={campaignsQuery.error?.message} onRetry={campaignsQuery.refetch} />
          ) : campaigns.length ? (
            <div className="overflow-x-auto wa-scrollbar">
              <table className="min-w-[820px] w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3 font-semibold">Campaign</th>
                    <th className="pb-3 font-semibold">Audience</th>
                    <th className="pb-3 font-semibold">Funnel</th>
                    <th className="pb-3 font-semibold">Spend</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="align-top">
                      <td className="py-4">
                        <p className="font-semibold text-slate-950">{campaign.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {campaign.templateName} · {getRelativeTime(campaign.createdAt)}
                        </p>
                      </td>
                      <td className="py-4 text-slate-600">{campaign.audience}</td>
                      <td className="py-4">
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <span>{formatCompactNumber(campaign.sent)} sent</span>
                          <span>{formatCompactNumber(campaign.delivered)} delivered</span>
                          <span>{formatCompactNumber(campaign.read)} read</span>
                          <span>{formatCompactNumber(campaign.replied)} replies</span>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-slate-800">
                        {formatCurrency(campaign.spend)}
                      </td>
                      <td className="py-4">
                        <StatusBadge>{campaign.status}</StatusBadge>
                        {campaign.scheduledAt && campaign.status === "scheduled" && (
                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(campaign.scheduledAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </td>
                      <td className="py-4">
                        {(campaign.status === "draft" || campaign.status === "scheduled") && (
                          <button
                            type="button"
                            onClick={() => sendCampaign.mutate(campaign.id)}
                            disabled={sendCampaign.isPending}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            <PaperAirplaneIcon className="h-3.5 w-3.5" />
                            Send now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={MegaphoneIcon} title="No campaigns yet" />
          )}
        </SectionPanel>

        <SectionPanel
          title="Create broadcast"
          description="Prepare template campaigns for opted-in contacts."
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Campaign name
              </span>
              <input
                value={form.name}
                onChange={(event) => setValue("name", event.target.value)}
                placeholder="Weekend activation"
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Template
              </span>
              <label className="block">


                <select
                  value={form.templateId}
                  onChange={(event) => setValue("templateId", event.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="">Choose template</option>

                  {(templatesQuery.data ?? []).map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Audience
              </span>
              <select
                value={form.audience}
                onChange={(event) => setValue("audience", event.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              >
                {AUDIENCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                {audienceLoading ? (
                  <span className="text-slate-400">Counting contacts…</span>
                ) : audienceCount === null ? null : audienceCount === 0 ? (
                  <span className="text-red-500 font-semibold">⚠ No contacts found for this audience</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">✓ {audienceCount} contacts will receive this campaign</span>
                )}
              </p>
            </label>

            {/* Send Now toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Send immediately</p>
                <p className="text-xs text-slate-500">Start sending as soon as campaign is created</p>
              </div>
              <button
                type="button"
                onClick={() => setValue("sendNow", !form.sendNow)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.sendNow ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.sendNow ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Schedule input — only shown when NOT sending now */}
            {!form.sendNow && (
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Schedule for later
                </span>
                <input
                  type="datetime-local"
                  value={form.scheduleAt}
                  onChange={(event) => setValue("scheduleAt", event.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
                {form.scheduleAt && (
                  <p className="mt-1 text-xs text-slate-500">
                    Will send at {new Date(form.scheduleAt).toLocaleString("en-IN")}
                  </p>
                )}
              </label>
            )}

            {successMsg && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                ✓ {successMsg}
              </p>
            )}

            {createError && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {createError}
              </p>
            )}

            <button
              type="submit"
              disabled={createCampaign.isPending || !form.name || !form.templateId || audienceCount === 0}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                form.sendNow
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {createCampaign.isPending
                ? "Processing…"
                : form.sendNow
                  ? `⚡ Send now · ${audienceCount ?? "…"} contacts`
                  : form.scheduleAt
                    ? `🕐 Schedule campaign · ${audienceCount ?? "…"} contacts`
                    : `Save as draft · ${audienceCount ?? "…"} contacts`}
            </button>
          </form>
        </SectionPanel>
      </div>
    </div>
  );
};

export default CampaignsPage;

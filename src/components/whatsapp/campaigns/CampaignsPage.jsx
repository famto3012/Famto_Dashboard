import { useMemo, useState } from "react";
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
import { useCreateWhatsappCampaign, useWhatsappCampaigns, useWhatsappTemplates } from "@/hooks/whatsapp/useWhatsappResources";
import { formatCompactNumber, formatCurrency, getRelativeTime } from "@/utils/whatsapp/formatters";

const CampaignsPage = () => {
  const campaignsQuery = useWhatsappCampaigns();
  const templatesQuery = useWhatsappTemplates();
  const createCampaign = useCreateWhatsappCampaign();
  const [form, setForm] = useState({
    name: "",
    templateId: "",
    audience: "All opted-in customers",
    scheduleAt: "",
  });

  const campaigns = useMemo(
    () => campaignsQuery.data ?? [],
    [campaignsQuery.data]
  );
  const stats = useMemo(
    () =>
      campaigns.reduce(
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

    if (!form.name || !form.templateId) return;

    const payload = {
      name: form.name,
      templateId: form.templateId,
      audience: form.audience,
      scheduledAt: form.scheduleAt || null,
    };

    createCampaign.mutate(payload, {
      onSuccess: () =>
        setForm({
          name: "",
          templateId: "",
          audience: "All opted-in customers",
          scheduleAt: "",
        }),
    });
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
                <option>All opted-in customers</option>
                <option>Inactive customers</option>
                <option>VIP customers</option>
                <option>Delayed orders</option>
                <option>CSV import segment</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Schedule
              </span>
              <input
                type="datetime-local"
                value={form.scheduleAt}
                onChange={(event) => setValue("scheduleAt", event.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <button
              type="submit"
              disabled={
                createCampaign.isPending ||
                !form.name ||
                !form.templateId
              }
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createCampaign.isPending ? "Creating..." : "Create campaign"}
            </button>
          </form>
        </SectionPanel>
      </div>
    </div>
  );
};

export default CampaignsPage;

import {
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  CurrencyRupeeIcon,
  EnvelopeIcon,
  InboxIcon,
  MegaphoneIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import SectionPanel from "../common/SectionPanel";
import StatCard from "../common/StatCard";
import StatusBadge from "../common/StatusBadge";
import { useWhatsappWallet } from "@/hooks/whatsapp/useWhatsappResources";
import { formatCurrency } from "@/utils/whatsapp/formatters";

const qualityColor = {
  GREEN: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  YELLOW: "text-amber-600 bg-amber-50 ring-amber-200",
  RED: "text-red-600 bg-red-50 ring-red-200",
  UNKNOWN: "text-slate-500 bg-slate-100 ring-slate-200",
};

const categoryBar = {
  violet: "bg-violet-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
};

const categoryBadge = {
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
};

const WalletRechargePage = () => {
  const walletQuery = useWhatsappWallet();
  const wallet = walletQuery.data;

  if (walletQuery.isLoading) return <LoadingRows count={4} />;
  if (walletQuery.isError)
    return <ErrorState message={walletQuery.error?.message} onRetry={walletQuery.refetch} />;
  if (!wallet)
    return <ErrorState message="Unable to load billing data" onRetry={walletQuery.refetch} />;

  const thisMonth = wallet.thisMonth || {};
  const lastMonth = wallet.lastMonth || {};
  const pricing = wallet.pricing || [];
  const campaigns = wallet.campaigns || {};
  const phone = wallet.phone || {};

  const totalConversations = thisMonth.conversations || 0;

  const spendChange =
    lastMonth.spend > 0
      ? (((thisMonth.spend - lastMonth.spend) / lastMonth.spend) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-5">

      {/* ── Top stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Estimated spend"
          value={formatCurrency(thisMonth.spend || 0)}
          hint={thisMonth.periodLabel || "This month"}
          icon={CurrencyRupeeIcon}
          tone="amber"
        />
        <StatCard
          label="Conversations"
          value={(totalConversations).toLocaleString()}
          hint="Unique contact windows (24h)"
          icon={ChatBubbleLeftRightIcon}
        />
        <StatCard
          label="Messages sent"
          value={(thisMonth.messages?.sent || 0).toLocaleString()}
          hint={`${thisMonth.messages?.received || 0} received`}
          icon={EnvelopeIcon}
          tone="sky"
        />
        <StatCard
          label="Last month spend"
          value={formatCurrency(lastMonth.spend || 0)}
          hint={
            spendChange !== null
              ? `${spendChange > 0 ? "+" : ""}${spendChange}% vs last month`
              : lastMonth.periodLabel || "Previous month"
          }
          icon={ArrowTrendingUpIcon}
          tone={spendChange > 0 ? "rose" : "emerald"}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* ── Conversation cost breakdown ── */}
        <SectionPanel
          title="Conversation cost breakdown"
          description="Meta charges per 24-hour conversation window, not per message. Each unique contact = 1 conversation."
        >
          <div className="space-y-3">
            {pricing.map((item) => {
              const pct =
                totalConversations > 0
                  ? Math.round((item.conversations / totalConversations) * 100)
                  : 0;
              const color = item.color || "emerald";
              const avgPerMsg =
                item.messages > 0
                  ? formatCurrency(item.spend / item.messages)
                  : null;

              return (
                <div
                  key={item.category}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${categoryBadge[color]}`}
                      >
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400">{item.description}</span>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      {formatCurrency(item.rate)}/conv
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {item.conversations} conversation{item.conversations !== 1 ? "s" : ""}
                        {pct > 0 && (
                          <span className="ml-1 text-slate-400">({pct}%)</span>
                        )}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(item.spend)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${categoryBar[color]}`}
                        style={{ width: `${Math.max(pct, item.conversations > 0 ? 3 : 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Detail row */}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {item.messages > 0 && (
                      <span>
                        📨 <strong className="text-slate-700">{item.messages}</strong> messages
                      </span>
                    )}
                    {item.conversations > 0 && (
                      <span>
                        💬 avg{" "}
                        <strong className="text-slate-700">
                          {item.messages > 0
                            ? (item.messages / item.conversations).toFixed(1)
                            : "—"}
                        </strong>{" "}
                        msg/conv
                      </span>
                    )}
                    {avgPerMsg && (
                      <span>
                        ≈ <strong className="text-slate-700">{avgPerMsg}</strong>/message
                      </span>
                    )}
                    {item.rate === 0 && item.conversations > 0 && (
                      <span className="font-medium text-emerald-600">✓ FREE</span>
                    )}
                  </div>
                </div>
              );
            })}

            {pricing.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">
                No conversation data this month yet.
              </p>
            )}

            {/* Total row */}
            {pricing.length > 0 && (
              <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-700">
                  Total — {totalConversations} conversations
                </span>
                <span className="text-base font-bold text-slate-900">
                  {formatCurrency(thisMonth.spend || 0)}
                </span>
              </div>
            )}

            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <strong>Note:</strong> {wallet.billingNote}
            </div>
          </div>
        </SectionPanel>

        {/* ── Campaign performance ── */}
        <SectionPanel
          title="Campaign performance"
          description="Stats for campaigns sent this month through the dashboard."
          icon={MegaphoneIcon}
        >
          {campaigns.total > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Campaigns sent", value: campaigns.total, color: "text-slate-900" },
                  { label: "Messages sent", value: (campaigns.sent || 0).toLocaleString(), color: "text-slate-900" },
                  { label: "Delivered", value: `${campaigns.deliveryRate || 0}%`, color: "text-emerald-600" },
                  { label: "Read", value: `${campaigns.readRate || 0}%`, color: "text-sky-600" },
                  { label: "Failed", value: (campaigns.failed || 0).toLocaleString(), color: campaigns.failed > 0 ? "text-red-500" : "text-slate-400" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Funnel bars */}
              <div className="space-y-2">
                {[
                  { label: "Delivered", pct: campaigns.deliveryRate || 0, color: "bg-emerald-500" },
                  { label: "Read", pct: campaigns.readRate || 0, color: "bg-sky-500" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{bar.label}</span>
                      <span className="font-semibold">{bar.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${bar.color}`}
                        style={{ width: `${bar.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              No campaigns sent this month yet.
            </p>
          )}
        </SectionPanel>
      </div>

      {/* ── Phone health ── */}
      <SectionPanel
        title="Phone number health"
        description="Live status from Meta. Quality rating affects your messaging limit tier."
        icon={PhoneIcon}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Number</p>
            <p className="mt-1 font-semibold text-slate-900">
              {phone.displayNumber || "+91 97785 57189"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Verified name</p>
            <div className="mt-1 flex items-center gap-1.5">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
              <p className="font-semibold text-slate-900">
                {phone.verifiedName || "Famto"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quality rating</p>
            <div className="mt-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${
                  qualityColor[phone.rating] || qualityColor.UNKNOWN
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {phone.rating || "UNKNOWN"}
              </span>
            </div>
          </div>
        </div>

        {/* Messaging limit */}
        {phone.messagingLimit && phone.messagingLimit !== "UNKNOWN" && (
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Messaging limit</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">{phone.messagingLimit}</p>
          </div>
        )}

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">What quality rating means</p>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <p>
                <strong className="text-slate-700">GREEN</strong> — Healthy. No sending
                restrictions. Full messaging limit active.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              <p>
                <strong className="text-slate-700">YELLOW</strong> — Warning. Recipients are
                blocking or reporting messages. Reduce marketing volume.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
              <p>
                <strong className="text-slate-700">RED</strong> — Restricted. Meta may lower your
                messaging limit tier. Stop marketing campaigns immediately.
              </p>
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* ── Last month summary ── */}
      <SectionPanel
        title="Last month summary"
        description={lastMonth.periodLabel || "Previous month comparison"}
        icon={InboxIcon}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Estimated spend</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(lastMonth.spend || 0)}
            </p>
            {spendChange !== null && (
              <p className={`mt-1 text-xs font-semibold ${Number(spendChange) > 0 ? "text-red-500" : "text-emerald-600"}`}>
                {Number(spendChange) > 0 ? "▲" : "▼"} {Math.abs(spendChange)}% this month
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Messages sent</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {(lastMonth.messages?.sent || 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Messages received</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {(lastMonth.messages?.received || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </SectionPanel>

    </div>
  );
};

export default WalletRechargePage;

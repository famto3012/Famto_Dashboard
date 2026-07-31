import {
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  MegaphoneIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ErrorState from "../common/ErrorState";
import LoadingRows from "../common/LoadingRows";
import SectionPanel from "../common/SectionPanel";
import StatCard from "../common/StatCard";
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

const STATUS_COLORS = {
  APPROVED: "text-emerald-700 bg-emerald-50",
  PENDING: "text-amber-700 bg-amber-50",
  REJECTED: "text-red-700 bg-red-50",
  PAUSED: "text-slate-600 bg-slate-100",
  DISABLED: "text-slate-500 bg-slate-100",
};

const DELIVERY_COLORS = ["#94a3b8", "#3b82f6", "#10b981", "#06b6d4", "#ef4444"];

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
  const account = wallet.account || {};
  const delivery = wallet.delivery || {};
  const topTemplates = wallet.topTemplates || [];
  const templates = wallet.templates || {};

  const totalConversations = thisMonth.conversations || 0;

  const spendChange =
    lastMonth.spend > 0
      ? (((thisMonth.spend - lastMonth.spend) / lastMonth.spend) * 100).toFixed(1)
      : null;

  const deliveryPieData = [
    { name: "Pending", value: delivery.pending || 0 },
    { name: "Sent", value: delivery.sent || 0 },
    { name: "Delivered", value: delivery.delivered || 0 },
    { name: "Read", value: delivery.read || 0 },
    { name: "Failed", value: delivery.failed || 0 },
  ].filter((d) => d.value > 0);

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
          value={totalConversations.toLocaleString()}
          hint="Unique contact windows (24h)"
          icon={ChatBubbleLeftRightIcon}
        />
        <StatCard
          label="Messages sent"
          value={(thisMonth.messages?.sent || 0).toLocaleString()}
          hint={`${thisMonth.messages?.received || 0} received · ${thisMonth.messages?.total || 0} total`}
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

      {/* ── Meta Account & Phone Health ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionPanel
          title="WhatsApp Business Account"
          description="Live account details from Meta"
          icon={ShieldCheckIcon}
        >
          <div className="space-y-3">
            {[
              { label: "Account Name", value: account.name },
              { label: "Business Name", value: account.businessName },
              { label: "Review Status", value: account.reviewStatus, badge: true },
              { label: "Timezone", value: account.timezone },
              { label: "Template Namespace", value: account.templateNamespace, mono: true },
            ]
              .filter((r) => r.value)
              .map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                  <span className="text-xs font-medium text-slate-500">{row.label}</span>
                  {row.badge ? (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.value === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700"
                          : row.value === "PENDING"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {row.value}
                    </span>
                  ) : (
                    <span className={`text-sm font-semibold text-slate-900 ${row.mono ? "font-mono text-xs" : ""}`}>
                      {row.value}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Phone number health"
          description="Live status from Meta — quality rating affects messaging limits"
          icon={PhoneIcon}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Number</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{phone.displayNumber || "—"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Verified name</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{phone.verifiedName || "—"}</p>
              </div>
            </div>

            {[
              { label: "Quality Rating", value: phone.rating, isQuality: true },
              { label: "Messaging Limit", value: phone.messagingLimit },
              { label: "Phone Status", value: phone.phoneStatus },
              { label: "Name Status", value: phone.nameStatus },
              { label: "Platform", value: phone.platform },
              { label: "Throughput", value: phone.throughput },
              { label: "Official Business Account", value: phone.isOfficialAccount ? "Yes" : "No" },
              { label: "Code Verification", value: phone.codeVerification },
            ]
              .filter((r) => r.value && r.value !== "UNKNOWN")
              .map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                  <span className="text-xs font-medium text-slate-500">{row.label}</span>
                  {row.isQuality ? (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                        qualityColor[row.value] || qualityColor.UNKNOWN
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {row.value}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                  )}
                </div>
              ))}
          </div>
        </SectionPanel>
      </div>

      {/* ── Daily usage chart ── */}
      {thisMonth.dailyUsage?.length > 0 && (
        <SectionPanel
          title="Daily usage this month"
          description={`Estimated spend per day — ${thisMonth.periodLabel || "This month"}`}
          icon={CurrencyRupeeIcon}
        >
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={thisMonth.dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(d) => {
                    const dt = new Date(d + "T00:00:00");
                    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                  }}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value, name) => [name === "spend" ? `₹${value}` : value, name === "spend" ? "Spend" : name === "sent" ? "Sent" : "Received"]}
                  labelFormatter={(d) => {
                    const dt = new Date(d + "T00:00:00");
                    return dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
                  }}
                />
                <Bar dataKey="spend" radius={[6, 6, 0, 0]} fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">Total messages sent</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {thisMonth.dailyUsage.reduce((sum, d) => sum + d.sent, 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">Total received</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {thisMonth.dailyUsage.reduce((sum, d) => sum + d.received, 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500">Avg daily spend</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(thisMonth.dailyUsage.reduce((sum, d) => sum + d.spend, 0) / thisMonth.dailyUsage.length)}
              </p>
            </div>
          </div>
        </SectionPanel>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ── Conversation cost breakdown ── */}
        <SectionPanel
          title="Conversation cost breakdown"
          description="Meta charges per 24-hour conversation window, not per message."
        >
          <div className="space-y-3">
            {pricing.map((item) => {
              const pct = totalConversations > 0 ? Math.round((item.conversations / totalConversations) * 100) : 0;
              const color = item.color || "emerald";

              return (
                <div key={item.category} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${categoryBadge[color]}`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400">{item.description}</span>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      {formatCurrency(item.rate)}/conv
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {item.conversations} conv{item.conversations !== 1 ? "s" : ""}
                        {pct > 0 && <span className="ml-1 text-slate-400">({pct}%)</span>}
                        {item.messages > 0 && <span className="ml-2 text-slate-400">· {item.messages} msgs</span>}
                      </span>
                      <span className="font-semibold text-slate-900">{formatCurrency(item.spend)}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${categoryBar[color]}`}
                        style={{ width: `${Math.max(pct, item.conversations > 0 ? 3 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {pricing.length > 0 && (
              <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-700">Total — {totalConversations} conversations</span>
                <span className="text-base font-bold text-slate-900">{formatCurrency(thisMonth.spend || 0)}</span>
              </div>
            )}
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <strong>Note:</strong> {wallet.billingNote}
            </div>
          </div>
        </SectionPanel>

        {/* ── Message delivery funnel ── */}
        <SectionPanel
          title="Message delivery status"
          description="Outbound message delivery funnel this month"
          icon={CheckCircleIcon}
        >
          {deliveryPieData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={deliveryPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {deliveryPieData.map((_, index) => (
                        <Cell key={index} fill={DELIVERY_COLORS[index % DELIVERY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Pending", value: delivery.pending, color: "bg-slate-400" },
                  { label: "Sent", value: delivery.sent, color: "bg-blue-500" },
                  { label: "Delivered", value: delivery.delivered, color: "bg-emerald-500" },
                  { label: "Read", value: delivery.read, color: "bg-cyan-500" },
                  { label: "Failed", value: delivery.failed, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className="ml-auto text-sm font-semibold text-slate-900">{(item.value || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No outbound messages this month yet.</p>
          )}
        </SectionPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ── Top templates ── */}
        <SectionPanel title="Top templates" description="Most used templates this month by message volume">
          {topTemplates.length > 0 ? (
            <div className="space-y-2">
              {topTemplates.map((t) => (
                <div key={t.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                    <span className="text-xs text-slate-500">{t.sent} sent</span>
                  </div>
                  <div className="mt-2 flex gap-3 text-xs text-slate-500">
                    <span>
                      ✓ {t.deliveryRate}% delivered
                    </span>
                    <span>
                      👁 {t.readRate}% read
                    </span>
                    {t.failed > 0 && (
                      <span className="text-red-500">✗ {t.failed} failed</span>
                    )}
                  </div>
                  <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="bg-emerald-500" style={{ width: `${t.deliveryRate}%` }} />
                    <div className="bg-cyan-500" style={{ width: `${t.readRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No template messages sent this month.</p>
          )}
        </SectionPanel>

        {/* ── Template status from Meta ── */}
        <SectionPanel
          title="Template library status"
          description={`${templates.total || 0} templates on Meta — live status`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(templates.statusCounts || {}).map(([status, count]) => (
                <div key={status} className={`rounded-xl p-3 ${STATUS_COLORS[status] || "bg-slate-50 text-slate-700"}`}>
                  <p className="text-xs font-medium opacity-75">{status}</p>
                  <p className="mt-1 text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
            {Object.keys(templates.byCategory || {}).length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">By category</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(templates.byCategory).map(([cat, count]) => (
                    <span key={cat} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {cat}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionPanel>
      </div>

      {/* ── Campaign performance ── */}
      <SectionPanel
        title="Campaign performance"
        description="Stats for campaigns sent this month through the dashboard"
        icon={MegaphoneIcon}
      >
        {campaigns.total > 0 ? (
          <div className="grid gap-3 sm:grid-cols-5">
            {[
              { label: "Campaigns", value: campaigns.total, color: "text-slate-900" },
              { label: "Sent", value: (campaigns.sent || 0).toLocaleString(), color: "text-slate-900" },
              { label: "Delivered", value: `${campaigns.deliveryRate || 0}%`, color: "text-emerald-600" },
              { label: "Read", value: `${campaigns.readRate || 0}%`, color: "text-sky-600" },
              { label: "Failed", value: (campaigns.failed || 0).toLocaleString(), color: campaigns.failed > 0 ? "text-red-500" : "text-slate-400" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">No campaigns sent this month yet.</p>
        )}
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
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(lastMonth.spend || 0)}</p>
            {spendChange !== null && (
              <p className={`mt-1 text-xs font-semibold ${Number(spendChange) > 0 ? "text-red-500" : "text-emerald-600"}`}>
                {Number(spendChange) > 0 ? "▲" : "▼"} {Math.abs(spendChange)}% this month
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Messages sent</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{(lastMonth.messages?.sent || 0).toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Messages received</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{(lastMonth.messages?.received || 0).toLocaleString()}</p>
          </div>
        </div>
      </SectionPanel>
    </div>
  );
};

export default WalletRechargePage;

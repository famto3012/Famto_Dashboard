import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
import { useWhatsappAnalytics } from "@/hooks/whatsapp/useWhatsappResources";
import { formatCompactNumber, formatCurrency } from "@/utils/whatsapp/formatters";

const rangeOptions = [
  { label: "7 Days", value: "7d" },
  { label: "14 Days", value: "14d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

const TYPE_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
];

const DELIVERY_COLORS = {
  pending: "#94a3b8",
  sent: "#3b82f6",
  delivered: "#10b981",
  read: "#06b6d4",
  failed: "#ef4444",
};

const qualityColor = {
  GREEN: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  YELLOW: "text-amber-600 bg-amber-50 ring-amber-200",
  RED: "text-red-600 bg-red-50 ring-red-200",
  UNKNOWN: "text-slate-500 bg-slate-100 ring-slate-200",
};

const AnalyticsDashboard = () => {
  const [range, setRange] = useState("7d");
  const analyticsQuery = useWhatsappAnalytics(range);
  const analytics = analyticsQuery.data;

  if (analyticsQuery.isLoading) return <LoadingRows count={6} />;
  if (analyticsQuery.isError)
    return <ErrorState message={analyticsQuery.error?.message} onRetry={analyticsQuery.refetch} />;
  if (!analytics) return <ErrorState message="Unable to load analytics" onRetry={analyticsQuery.refetch} />;

  const summary = analytics.summary || {};
  const delivery = analytics.delivery || {};
  const messageTypes = analytics.messageTypes || [];
  const hourlyActivity = analytics.hourlyActivity || [];
  const topTemplates = analytics.topTemplates || [];
  const phone = analytics.phone || {};

  const deliveryPieData = [
    { name: "Pending", value: delivery.pending || 0, color: DELIVERY_COLORS.pending },
    { name: "Sent", value: delivery.sent || 0, color: DELIVERY_COLORS.sent },
    { name: "Delivered", value: delivery.delivered || 0, color: DELIVERY_COLORS.delivered },
    { name: "Read", value: delivery.read || 0, color: DELIVERY_COLORS.read },
    { name: "Failed", value: delivery.failed || 0, color: DELIVERY_COLORS.failed },
  ].filter((d) => d.value > 0);

  const peakHour = hourlyActivity.reduce(
    (max, h) => (h.total > max.total ? h : max),
    { total: 0, label: "—" }
  );

  return (
    <div className="space-y-5">
      {/* ── Range selector ── */}
      <div className="flex items-center justify-end gap-2">
        {rangeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRange(opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              range === opt.value
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Summary stat cards ── */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Conversations"
          value={formatCompactNumber(summary.conversations || 0)}
          hint={`${summary.openConversations || 0} open · ${summary.closedConversations || 0} closed`}
          icon={ChatBubbleLeftRightIcon}
        />
        <StatCard
          label="First response"
          value={`${summary.avgFirstResponseMins || 0}m`}
          hint="Avg time to first reply"
          icon={ClockIcon}
          tone="sky"
        />
        <StatCard
          label="Resolution rate"
          value={`${summary.resolutionRate || 0}%`}
          hint={`${summary.closedConversations || 0} resolved of ${summary.conversations || 0}`}
          icon={PresentationChartLineIcon}
          tone="violet"
        />
        <StatCard
          label="Total messages"
          value={formatCompactNumber(summary.totalMessages?.total || 0)}
          hint={`${formatCompactNumber(summary.totalMessages?.sent || 0)} sent · ${formatCompactNumber(summary.totalMessages?.received || 0)} received`}
          icon={EnvelopeIcon}
          tone="amber"
        />
      </div>

      {/* ── Conversation trend + Campaign funnel ── */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <SectionPanel title="Conversation trend" description={`Messages over the last ${range}`}>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.conversationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="inbound" stroke="#059669" strokeWidth={3} dot={false} name="Inbound" />
                <Line type="monotone" dataKey="outbound" stroke="#0284c7" strokeWidth={3} dot={false} name="Outbound" />
                <Line type="monotone" dataKey="resolved" stroke="#7c3aed" strokeWidth={3} dot={false} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel title="Campaign funnel" description="Campaign delivery health">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.campaignFunnel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>
      </div>

      {/* ── Message types + Delivery status ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionPanel title="Message type breakdown" description="Distribution by content type">
          {messageTypes.length > 0 ? (
            <div className="space-y-3">
              {messageTypes.map((t, i) => {
                const pct = summary.totalMessages?.total > 0
                  ? Math.round((t.total / summary.totalMessages.total) * 100)
                  : 0;
                return (
                  <div key={t.type} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length] }}
                        />
                        <span className="text-sm font-semibold capitalize text-slate-900">{t.type}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{t.total.toLocaleString()}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(pct, t.total > 0 ? 3 : 0)}%`,
                              backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-slate-500">{pct}%</span>
                      <span className="shrink-0 text-xs text-slate-400">
                        ↑{t.outbound} ↓{t.inbound}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No messages in this period.</p>
          )}
        </SectionPanel>

        <SectionPanel
          title="Delivery status"
          description={`${delivery.deliveryRate || 0}% delivery rate · ${delivery.readRate || 0}% read rate`}
          icon={CheckCircleIcon}
        >
          {deliveryPieData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={deliveryPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {deliveryPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(DELIVERY_COLORS).map(([key, color]) => (
                  <div key={key} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs capitalize text-slate-500">{key}</span>
                    <span className="ml-auto text-sm font-semibold text-slate-900">
                      {(delivery[key] || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No outbound messages in this period.</p>
          )}
        </SectionPanel>
      </div>

      {/* ── Hourly activity heatmap ── */}
      <SectionPanel
        title="Hourly activity"
        description={`Peak hour: ${peakHour.label} (${peakHour.total} messages)`}
      >
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} interval={1} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Bar dataKey="inbound" stackId="a" fill="#059669" name="Inbound" radius={[0, 0, 0, 0]} />
              <Bar dataKey="outbound" stackId="a" fill="#0284c7" name="Outbound" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionPanel>

      {/* ── Top templates + Phone health ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionPanel title="Top templates" description={`Most used templates in the last ${range}`}>
          {topTemplates.length > 0 ? (
            <div className="space-y-2">
              {topTemplates.map((t) => (
                <div key={t.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                    <span className="text-xs text-slate-500">{t.sent} sent</span>
                  </div>
                  <div className="mt-2 flex gap-3 text-xs text-slate-500">
                    <span>✓ {t.deliveryRate}% delivered</span>
                    <span>👁 {t.readRate}% read</span>
                    {t.failed > 0 && <span className="text-red-500">✗ {t.failed} failed</span>}
                  </div>
                  <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="bg-emerald-500" style={{ width: `${t.deliveryRate}%` }} />
                    <div className="bg-cyan-500" style={{ width: `${Math.max(t.readRate - t.deliveryRate, 0)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No template messages in this period.</p>
          )}
        </SectionPanel>

        <SectionPanel
          title="Phone number health"
          description="Live status from Meta"
          icon={PhoneIcon}
        >
          <div className="space-y-2.5">
            {[
              { label: "Quality Rating", value: phone.rating, isQuality: true },
              { label: "Messaging Limit", value: phone.messagingLimit },
              { label: "Phone Status", value: phone.status },
              { label: "Throughput", value: phone.throughput },
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

      {/* ── Team performance ── */}
      <SectionPanel title="Team performance" description="Agent workload and message counts" icon={UserGroupIcon}>
        {analytics.teamPerformance?.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {analytics.teamPerformance.map((agent) => (
              <div key={agent.name} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{agent.name}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Conversations</p>
                    <p className="mt-1 font-semibold">{agent.conversations}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Messages</p>
                    <p className="mt-1 font-semibold">{agent.messageCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">No agent activity in this period.</p>
        )}
      </SectionPanel>
    </div>
  );
};

export default AnalyticsDashboard;

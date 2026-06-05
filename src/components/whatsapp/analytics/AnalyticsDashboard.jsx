import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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

const AnalyticsDashboard = () => {
  const analyticsQuery = useWhatsappAnalytics("7d");
  const analytics = analyticsQuery.data;

  if (analyticsQuery.isLoading) {
    return <LoadingRows count={6} />;
  }

  if (analyticsQuery.isError) {
    return (
      <ErrorState
        message={analyticsQuery.error?.message}
        onRetry={analyticsQuery.refetch}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Conversations"
          value={formatCompactNumber(analytics.summary.conversations)}
          hint={`${analytics.summary.openConversations} currently open`}
          icon={ChatBubbleLeftRightIcon}
        />
        <StatCard
          label="First response"
          value={`${analytics.summary.avgFirstResponseMins}m`}
          hint="Average support response"
          icon={ClockIcon}
          tone="sky"
        />
        <StatCard
          label="Resolution rate"
          value={`${analytics.summary.resolutionRate}%`}
          hint="Closed within SLA"
          icon={PresentationChartLineIcon}
          tone="violet"
        />
        <StatCard
          label="Campaign revenue"
          value={formatCurrency(analytics.summary.campaignRevenue)}
          hint="Attributed WhatsApp orders"
          icon={CurrencyRupeeIcon}
          tone="amber"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <SectionPanel title="Conversation trend" description="Inbound, outbound, and resolved messages over the last week.">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.conversationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="inbound" stroke="#059669" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="outbound" stroke="#0284c7" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="resolved" stroke="#7c3aed" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel title="Campaign funnel" description="Delivery, read, and reply health.">
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

      <SectionPanel title="Team performance" description="Agent workload, CSAT, and response speed.">
        <div className="grid gap-3 md:grid-cols-3">
          {analytics.teamPerformance.map((agent) => (
            <div key={agent.name} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-950">{agent.name}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Chats</p>
                  <p className="mt-1 font-semibold">{agent.conversations}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">CSAT</p>
                  <p className="mt-1 font-semibold">{agent.csat}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Resp.</p>
                  <p className="mt-1 font-semibold">{agent.avgResponse}m</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>
    </div>
  );
};

export default AnalyticsDashboard;

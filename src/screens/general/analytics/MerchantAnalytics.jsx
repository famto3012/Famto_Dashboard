import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { HStack, Table } from "@chakra-ui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "react-datepicker/dist/react-datepicker.css";

import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import {
  fetchAnalyticsSummary,
  fetchOrderTrend,
  fetchTopCustomers,
  fetchTopProducts,
  fetchDeliveryPerformance,
} from "@/hooks/analytics/useAnalytics";

const INTERVALS = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
];

const TEAL = "#0d9488";
const BLUE = "#2563eb";

const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const compact = (n) => {
  if (Math.abs(n) >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const formatMs = (ms) => {
  if (ms === null || ms === undefined) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
};

const labelFromKey = (key, interval) => {
  if (interval === "month") {
    const [y, m] = key.split("-");
    return new Date(Date.UTC(Number(y), Number(m) - 1, 1)).toLocaleDateString(
      "en-US",
      { month: "short", year: "2-digit", timeZone: "UTC" }
    );
  }
  return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

const StatCard = ({ label, value, sub, accent }) => (
  <div className="rounded-lg bg-white p-5 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className={`mt-2 text-2xl font-bold ${accent || "text-gray-900"}`}>
      {value}
    </p>
    {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
  </div>
);

const MerchantAnalytics = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 29);
    return [start, end];
  });
  const [interval, setInterval] = useState("day");
  const [customerPage, setCustomerPage] = useState(1);
  const [startDate, endDate] = dateRange;
  const customerLimit = 8;

  const rangeKey = `${startDate?.toLocaleDateString("en-CA")}_${endDate?.toLocaleDateString("en-CA")}`;

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["merchant-analytics-summary", rangeKey],
    queryFn: () => fetchAnalyticsSummary({ startDate, endDate, navigate }),
    enabled: !!startDate && !!endDate,
  });

  const { data: trendData } = useQuery({
    queryKey: ["merchant-analytics-trend", rangeKey, interval],
    queryFn: () => fetchOrderTrend({ startDate, endDate, interval, navigate }),
    enabled: !!startDate && !!endDate,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["merchant-analytics-customers", rangeKey, customerPage],
    queryFn: () =>
      fetchTopCustomers({
        startDate,
        endDate,
        page: customerPage,
        limit: customerLimit,
        navigate,
      }),
    enabled: !!startDate && !!endDate,
    placeholderData: keepPreviousData,
  });

  const { data: products } = useQuery({
    queryKey: ["merchant-analytics-products", rangeKey],
    queryFn: () =>
      fetchTopProducts({ startDate, endDate, limit: 8, navigate }),
    enabled: !!startDate && !!endDate,
  });

  const { data: delivery } = useQuery({
    queryKey: ["merchant-analytics-delivery", rangeKey],
    queryFn: () => fetchDeliveryPerformance({ startDate, endDate, navigate }),
    enabled: !!startDate && !!endDate,
  });

  if (summaryLoading) return <ShowSpinner />;

  const overview = summary?.overview || {};
  const customersSummary = summary?.customers || {};
  const trend = (trendData?.trend || []).map((t) => ({
    label: labelFromKey(t.key, trendData?.interval || interval),
    revenue: t.revenue,
    orders: t.orders,
  }));
  const del = delivery?.delivery || {};
  const topAgents = delivery?.topAgents || [];
  const productRows = products?.products || [];
  const customerRows = customers?.customers || [];

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />

      <div className="flex items-center justify-between mx-8 mt-5">
        <h1 className="text-lg font-bold">Analytics</h1>
        <div className="flex items-center gap-3">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
              setCustomerPage(1);
            }}
            dateFormat="yyyy/MM/dd"
            withPortal
            maxDate={new Date()}
            className="border-2 p-2 rounded-lg cursor-pointer outline-none focus:outline-none bg-white text-sm"
            placeholderText="Select Date range"
          />
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="mx-8 mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={inr(overview.totalRevenue)} accent="text-teal-700" />
        <StatCard label="Total Orders" value={overview.totalOrders || 0} accent="text-blue-700" />
        <StatCard label="Avg Order Value" value={inr(overview.avgOrderValue)} />
        <StatCard
          label="Avg Rating"
          value={overview.averageRating || "—"}
          sub={`${overview.totalReviews || 0} review(s)`}
        />
      </div>

      {/* ── Order trend + Customer cohort ── */}
      <div className="mx-8 mt-4 grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-gray-800">Order &amp; Revenue Trend</h2>
            <div className="flex rounded-md overflow-hidden border border-gray-200 text-xs">
              {INTERVALS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInterval(opt.value)}
                  className={`px-3 py-1.5 font-semibold ${
                    interval === opt.value
                      ? "bg-teal-700 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {trend.length ? (
            <div className="mt-4 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                  <YAxis
                    yAxisId="left"
                    stroke={TEAL}
                    fontSize={11}
                    tickFormatter={compact}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke={BLUE}
                    fontSize={11}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "Revenue" ? inr(value) : value
                    }
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke={TEAL}
                    strokeWidth={3}
                    dot={false}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke={BLUE}
                    strokeWidth={3}
                    dot={false}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-gray-400">
              No order data in this period.
            </p>
          )}
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800">Customer Insights</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Total customers", value: customersSummary.totalCustomers || 0 },
              { label: "Active (period)", value: customersSummary.activeCustomers || 0 },
              { label: "New (period)", value: customersSummary.newCustomers || 0 },
              { label: "Repeat customers", value: customersSummary.repeatCustomers || 0 },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <span className="text-sm text-gray-600">{row.label}</span>
                <span className="text-lg font-bold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Repeat rate</span>
              <span className="text-lg font-bold text-teal-700">
                {customersSummary.repeatRate || 0}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{ width: `${Math.min(customersSummary.repeatRate || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Top products + Delivery performance ── */}
      <div className="mx-8 mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800">Top Products</h2>
          <Table.Root className="mt-3" striped interactive>
            <Table.Header>
              <Table.Row>
                {["#", "Product", "Qty", "Revenue", "Orders"].map((h) => (
                  <Table.ColumnHeader key={h} textAlign="center">
                    {h}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {productRows.length ? (
                productRows.map((p, i) => (
                  <Table.Row key={`${p.productId}-${p.productName}-${i}`}>
                    <Table.Cell textAlign="center">{i + 1}</Table.Cell>
                    <Table.Cell textAlign="left">{p.productName}</Table.Cell>
                    <Table.Cell textAlign="center">{p.quantity}</Table.Cell>
                    <Table.Cell textAlign="center">{inr(p.revenue)}</Table.Cell>
                    <Table.Cell textAlign="center">{p.orderCount}</Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center">
                    No product sales in this period.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800">Delivery Performance</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Completion</p>
              <p className="mt-1 text-xl font-bold text-teal-700">
                {del.completionRate || 0}%
              </p>
              <p className="text-xs text-gray-500">
                {del.completedOrders || 0} of {del.totalOrders || 0} orders
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Avg delivery time</p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatMs(del.avgDeliveryTimeMs)}
              </p>
              <p className="text-xs text-gray-500">Avg distance {del.avgDistance || 0} km</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Completed</p>
              <p className="mt-1 text-xl font-bold text-green-600">
                {del.completedOrders || 0}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Cancelled</p>
              <p className="mt-1 text-xl font-bold text-red-500">
                {del.cancelledOrders || 0}
              </p>
            </div>
          </div>

          {topAgents.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700">Top agents</p>
              <div className="mt-2 space-y-2">
                {topAgents.map((a) => (
                  <div
                    key={`${a.agentId}-${a.agentName}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {a.agentName}
                      {a.agentPhone && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          {a.agentPhone}
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {a.deliveries} delivery
                      {a.deliveries > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Top customers ── */}
      <div className="mx-8 mt-4 rounded-lg bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800">Top Customers</h2>
        {customersLoading ? (
          <p className="py-6 text-center text-sm text-gray-400">Loading…</p>
        ) : (
          <>
            <Table.Root className="mt-3" striped interactive>
              <Table.Header>
                <Table.Row>
                  {["Customer", "Phone", "Orders", "Total Spent", "Avg Order", "Last Order"].map(
                    (h) => (
                      <Table.ColumnHeader key={h} textAlign="center">
                        {h}
                      </Table.ColumnHeader>
                    )
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {customerRows.length ? (
                  customerRows.map((c) => (
                    <Table.Row key={c.customerId || Math.random()}>
                      <Table.Cell textAlign="left">
                        {c.customerName || c.customerId || "Customer"}
                      </Table.Cell>
                      <Table.Cell textAlign="center">{c.customerPhone || "-"}</Table.Cell>
                      <Table.Cell textAlign="center">{c.orders}</Table.Cell>
                      <Table.Cell textAlign="center">{inr(c.totalSpent)}</Table.Cell>
                      <Table.Cell textAlign="center">{inr(c.avgOrderValue)}</Table.Cell>
                      <Table.Cell textAlign="center">
                        {c.lastOrderAt
                          ? new Date(c.lastOrderAt).toLocaleDateString()
                          : "-"}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6} textAlign="center">
                      No customers in this period.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>

            {customers?.total > 0 && (
              <PaginationRoot
                count={customers.total}
                page={customerPage}
                pageSize={customerLimit}
                defaultPage={1}
                onPageChange={(e) => setCustomerPage(e.page)}
                variant="solid"
                className="py-5 flex justify-center"
              >
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MerchantAnalytics;

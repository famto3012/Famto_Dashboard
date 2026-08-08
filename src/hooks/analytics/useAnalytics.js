import useApiClient from "@/api/apiClient";

const toDateParam = (d) =>
  d ? d.toLocaleDateString("en-CA") : "";

// GET /merchants/analytics/summary — headline cards + customer cohort
export const fetchAnalyticsSummary = async ({ startDate, endDate, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/analytics/summary", {
      params: { startDate: toDateParam(startDate), endDate: toDateParam(endDate) },
    });
    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching analytics summary: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch analytics summary");
  }
};

// GET /merchants/analytics/order-trend — sales + order time series
export const fetchOrderTrend = async ({ startDate, endDate, interval, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/analytics/order-trend", {
      params: {
        startDate: toDateParam(startDate),
        endDate: toDateParam(endDate),
        interval,
      },
    });
    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching order trend: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch order trend");
  }
};

// GET /merchants/analytics/customers — top spenders (paged)
export const fetchTopCustomers = async ({ startDate, endDate, page, limit, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/analytics/customers", {
      params: {
        startDate: toDateParam(startDate),
        endDate: toDateParam(endDate),
        page,
        limit,
      },
    });
    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching top customers: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch top customers");
  }
};

// GET /merchants/analytics/products — top products by revenue
export const fetchTopProducts = async ({ startDate, endDate, limit, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/analytics/products", {
      params: { startDate: toDateParam(startDate), endDate: toDateParam(endDate), limit },
    });
    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching top products: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch top products");
  }
};

// GET /merchants/analytics/delivery — delivery performance + top agents
export const fetchDeliveryPerformance = async ({ startDate, endDate, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/analytics/delivery", {
      params: { startDate: toDateParam(startDate), endDate: toDateParam(endDate) },
    });
    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching delivery performance: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch delivery performance");
  }
};

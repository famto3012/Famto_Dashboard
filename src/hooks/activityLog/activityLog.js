import useApiClient from "@/api/apiClient";

export const fetchAllActivityLogs = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/activity-log`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching all activity logs: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all activity logs"
    );
  }
};

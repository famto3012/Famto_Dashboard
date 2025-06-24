import useApiClient from "@/api/apiClient";

export const filterAllAccountLogs = async (role, date, query, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/account-log/filter`, {
      params: { role, date, query },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching all account logs: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all account logs"
    );
  }
};

export const unblockUserAccount = async (logId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/admin/account-log/unblock-user/${logId}`, {});

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in unblocking user account: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to unblock account");
  }
};

export const downloadAccountLogsCSV = async (role, date, query, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/account-log/csv`, {
      params: { role, date, query },
      responseType: "blob",
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in downloading account logs CSV: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to download account logs CSV"
    );
  }
};

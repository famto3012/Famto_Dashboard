import useApiClient from "@/api/apiClient";

export const applyCommissionToMerchant = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/commission/add-commission`, data);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in applying commission to merchant : ${err}`);
    throw new Error(
      err.response?.data?.message || "Error in applying commission to merchant"
    );
  }
};

export const fetchCommissionOfMerchant = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/commission/commission-detail`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching commission of merchant : ${err}`);
    throw new Error(
      err.response?.data?.message || "Error in fetch commission of merchant"
    );
  }
};

export const fetchCommissionLogs = async (
  filter,
  role,
  userId,
  page,
  limit,
  navigate
) => {
  try {
    console.log("userId", userId);

    const api = useApiClient(navigate);
    const res = await api.get(`/admin/commission/get-commission-log`, {
      params: {
        date: filter.date,
        merchantId: role === "Merchant" ? userId : filter.merchantId,
        merchantName: role === "Merchant" ? "" : filter.merchantName,
        page,
        limit,
      },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching commission logs of merchant : ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Error in fetch commission logs of merchant"
    );
  }
};

export const confirmCommissionPayment = async (logId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/admin/commission/commission-log/${logId}`, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(
      `Error in confirming commission payment of merchant : ${err}`
    );
    throw new Error(
      err.response?.data?.message || "Error in confirm commission of merchant"
    );
  }
};

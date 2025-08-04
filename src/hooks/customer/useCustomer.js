import useApiClient from "@/api/apiClient";

export const fetchCustomer = async (role, filter, page, limit, navigate) => {
  try {
    const route =
      role === "Merchant"
        ? `/admin/customers/fetch-customer-of-merchant`
        : `/admin/customers/fetch-customer`;

    const api = useApiClient(navigate);
    const res = await api.get(route, {
      params: {
        page,
        limit,
        geofence: filter.geofence,
        walletBalance: filter.walletBalance,
        query: filter.name,
      },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching all customer: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all customer"
    );
  }
};

export const fetchCustomerDetails = async (customerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/customers/${customerId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching customer details: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch customer details"
    );
  }
};

export const blockCustomer = async (customerId, reason, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/admin/customers/block-customer/${customerId}`,
      {
        reason,
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in blocking customer: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to block customer");
  }
};

export const addMoneyToWallet = async (customerId, amount, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/admin/customers/add-money-to-wallet/${customerId}`,
      {
        amount,
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in adding money to customer wallet: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to add money to customer wallet"
    );
  }
};

export const deductMoney = async (customerId, amount, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/admin/customers/deduct-money-from-wallet/${customerId}`,
      {
        amount,
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deducting money from customer wallet: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to deduct money from customer wallet"
    );
  }
};

export const fetchCustomerRatings = async (customerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/customers/ratings/${customerId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching customer ratings: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch customer ratings"
    );
  }
};

export const updateCustomerDetails = async (
  customerId,
  customerData,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/customers/edit-customer/${customerId}`,
      customerData
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating customer details: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update customer details"
    );
  }
};

export const downloadSampleCustomerCSV = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/customers/download-sample-customer-csv`, {
      responseType: "blob",
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to download sample customer csv"
    );
  }
};

export const downloadAllCustomerCSV = async (geofence, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/customers/download-customer-csv`, {
      params: { geofence },
      responseType: "blob",
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to download customer csv"
    );
  }
};

export const uploadCustomerCSV = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/customers/upload-customer-csv`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to upload customer csv"
    );
  }
};

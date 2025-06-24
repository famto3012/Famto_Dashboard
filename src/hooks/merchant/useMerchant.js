import useApiClient from "@/api/apiClient";

export const fetchMerchantsForDropDown = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/merchants/admin/all-merchant-drop-down`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch merchants."
    );
  }
};

export const fetchAllMerchants = async (filter, page, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/merchants/admin/fetch-merchant`, {
      params: {
        page,
        name: filter.name,
        serviceable: filter.status,
        businessCategory: filter.businessCategory,
        geofence: filter.geofence,
        subscriptionStatus: filter.subscriptionStatus,
      },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all merchants."
    );
  }
};

export const approveMerchant = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/merchants/admin/approve-merchant/${merchantId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(err);
    throw new Error(
      err.response?.data?.message || "Failed to approve merchant."
    );
  }
};

export const rejectMerchant = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/merchants/admin/reject-merchant/${merchantId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(err);
    throw new Error(
      err.response?.data?.message || "Failed to reject merchant."
    );
  }
};

export const createNewMerchant = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/merchants/admin/add-merchant`, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || { message: "Failed to create merchant" }
    );
  }
};

export const fetchSingleMerchantDetail = async (role, merchantId, navigate) => {
  try {
    const route =
      role === "Merchant"
        ? `/merchants/profile`
        : `/merchants/admin/${merchantId}`;

    const api = useApiClient(navigate);
    const res = await api.get(route);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch merchant detail"
    );
  }
};

export const updateMerchantDetail = async (
  role,
  merchantId,
  data,
  navigate
) => {
  try {
    const route =
      role === "Merchant"
        ? `/merchants/update-merchant-details`
        : `/merchants/admin/update-merchant-details/${merchantId}`;

    const api = useApiClient(navigate);
    const res = await api.put(route, data);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(err);
    throw new Error(
      err.response?.data?.message || "Failed to update merchant detail"
    );
  }
};

export const blockMerchant = async (merchantId, reason, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/merchants/admin/block-merchant/${merchantId}`, {
      reasonForBlocking: reason,
    });

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Failed to block merchant");
  }
};

export const deleteMerchant = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/merchants/admin/delete-merchant/${merchantId}`
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Failed to delete merchant");
  }
};

export const updateStatusMutation = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/merchants/admin/change-status/${merchantId}`,
      {}
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(err);
    throw new Error(
      err.response?.data?.message || "Failed to update merchant status"
    );
  }
};

export const updateMerchant = async (role, merchantId, data, navigate) => {
  try {
    const route =
      role === "Merchant"
        ? `/merchants/edit-profile`
        : `/merchants/admin/edit-merchant/${merchantId}`;

    const api = useApiClient(navigate);
    const res = await api.put(route, data);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || { message: "Failed to update merchant" }
    );
  }
};

export const fetchMerchantPayout = async (filter, page, limit, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/merchants/admin/payout`, {
      params: {
        page,
        limit,
        paymentStatus: filter.status,
        merchantId: filter.merchantId,
        geofenceId: filter.geofenceId,
        query: filter.name,
        startDate: filter.date[0],
        endDate: filter.date[1],
      },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch all merchant payout"
    );
  }
};

export const approveMerchantPayout = async (merchantId, payoutId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/merchants/admin/payout/${merchantId}/${payoutId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to approve merchant payout"
    );
  }
};

export const fetchMerchantPayoutDetail = async (date, merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/merchants/admin/payout-detail`, {
      params: {
        date,
        merchantId,
        timezoneOffset: 0,
      },
    });

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch merchant payout detail"
    );
  }
};

export const downloadMerchantPayoutCSV = async (filter, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/merchants/admin/payout-csv`, {
      params: {
        paymentStatus: filter.status,
        merchantId: filter.merchantId,
        geofenceId: filter.geofenceId,
        query: filter.name,
        startDate: filter.date[0],
        endDate: filter.date[1],
      },
      responseType: "blob",
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to download merchant payout csv"
    );
  }
};

export const downloadSampleMerchantCSV = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/merchants/admin/download-sample-merchant-csv`, {
      responseType: "blob",
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to download sample merchant csv"
    );
  }
};

export const downloadAllMerchantCSV = async (filter, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/merchants/admin/download-csv`,
      {},
      {
        params: {
          name: filter.name,
          serviceable: filter.status,
          businessCategory: filter.businessCategory,
          geofence: filter.geofence,
          subscriptionStatus: filter.subscriptionStatus,
        },
        responseType: "blob",
      }
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to download sample merchant csv"
    );
  }
};

export const uploadMerchantCSV = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/merchants/admin/upload-merchant-csv`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to upload merchant csv"
    );
  }
};

export const fetchMerchantFromBusinessCategory = async (
  businessCategoryId,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/merchants/admin/merchant-from-businessCategory`,
      { params: { businessCategoryId } }
    );

    return res.status === 200 ? res.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        "Failed to get merchant from business category"
    );
  }
};

//For all

export const updateMerchantStatusForMerchant = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(`/merchants/change-status`, {});
    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to change merchant status"
    );
  }
};

export const updateMerchantStatusForMerchantToggle = async (
  navigate,
  status
) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.patch(`/merchants/change-status-toggle`, { status });
    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to change merchant status"
    );
  }
};

export const initiateSponsorshipPayment = async (
  data,
  merchantId,
  navigate
) => {
  try {
    const api = useApiClient(navigate);

    console.log({ data });

    const res = await api.post(
      `/merchants/sponsorship-payment/${merchantId}`,
      data
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(
      `Error initiating sponsorship plan payment for merchant: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to initiate sponsorship plan payment for merchant"
    );
  }
};

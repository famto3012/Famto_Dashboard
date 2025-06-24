import useApiClient from "@/api/apiClient";

export const fetchLoyaltyPointDetail = async (navigate) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.get(`/admin/loyalty-point`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching loyalty point detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch loyalty point detail."
    );
  }
};

export const updateLoyaltyPointDetail = async (loyaltyData, navigate) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.post(
      `/admin/loyalty-point/add-loyalty-point`,
      loyaltyData
    );

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in updating loyalty point detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update loyalty point detail."
    );
  }
};

export const updateLoyaltyPointStatus = async (navigate) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.patch(`/admin/loyalty-point`, {});

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in updating loyalty point status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update loyalty point status."
    );
  }
};

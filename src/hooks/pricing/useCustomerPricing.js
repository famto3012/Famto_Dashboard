import useApiClient from "@/api/apiClient";

// Customer pricing
// ========================
export const fetchAllCustomerPricing = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/customer-pricing/get-all-customer-pricing`
    );

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all customer pricing: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all customer pricing."
    );
  }
};

export const fetchSingleCustomerPricing = async (pricingId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/customer-pricing/${pricingId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching customer pricing detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch customer pricing detail."
    );
  }
};

export const createCustomerPricing = async (pricingData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/customer-pricing/add-customer-pricing`,
      pricingData
    );

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || { message: "Failed to create new pricing" }
    );
  }
};

export const updateCustomerPricing = async (
  pricingId,
  pricingData,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/customer-pricing/edit-customer-pricing/${pricingId}`,
      pricingData
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw err.response?.data?.errors || { message: "Failed to update pricing" };
  }
};

export const deleteCustomerPricing = async (pricingId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/customer-pricing/delete-customer-pricing/${pricingId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting customer pricing: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete customer pricing."
    );
  }
};

export const updateCustomerPricingStatus = async (pricingId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/customer-pricing//change-status/${pricingId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating customer pricing status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update customer pricing status."
    );
  }
};

// Customer surge
// ========================
export const fetchAllCustomerSurge = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/customer-surge/get-all-customer-surge`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all customer surge: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all customer surge."
    );
  }
};

export const fetchSingleCustomerSurge = async (surgeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/customer-surge/${surgeId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching customer surge detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch customer surge detail."
    );
  }
};

export const createCustomerSurge = async (surgeData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/customer-surge/add-customer-surge`,
      surgeData
    );

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating customer surge: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to create customer surge."
    );
  }
};

export const updateCustomerSurge = async (surgeId, surgeData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/customer-surge/edit-customer-surge/${surgeId}`,
      surgeData
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating customer surge: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update customer surge."
    );
  }
};

export const deleteCustomerSurge = async (surgeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/customer-surge/delete-customer-surge/${surgeId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting customer surge: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete customer surge."
    );
  }
};

export const updateCustomerSurgeStatus = async (surgeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/customer-surge/change-status/${surgeId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating customer surge status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update customer surge status."
    );
  }
};

import useApiClient from "@/api/apiClient";

export const fetchGlobalFeatureConfig = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/admin/feature-config");

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching global feature config: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch feature config.");
  }
};

export const updateGlobalFeatureConfig = async (configData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put("/admin/feature-config", configData);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in updating global feature config: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to update feature config.");
  }
};

// Admin merchant list for the override picker. `limit` caps the dropdown;
// filter by merchant name server-side when it grows.
export const fetchAdminMerchants = async (navigate, page = 1, limit = 100) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/admin/all-merchants", {
      params: { page, limit },
    });
    return res.status === 200 ? res.data.merchants : [];
  } catch (err) {
    console.error(`Error in fetching admin merchants: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch merchants.");
  }
};

export const fetchMerchantFeatureOverrides = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/admin/feature-config/merchants");

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching merchant feature overrides: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch merchant overrides.");
  }
};

export const fetchMerchantFeatureOverride = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/feature-config/merchant/${merchantId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching merchant feature override: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch merchant override.");
  }
};

export const upsertMerchantFeatureOverride = async (merchantId, overrideData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/admin/feature-config/merchant/${merchantId}`, overrideData);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in upserting merchant feature override: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to upsert merchant override.");
  }
};
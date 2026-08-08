import useApiClient from "@/api/apiClient";

export const fetchMerchantFeatureConfig = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/feature-config");

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching merchant feature config: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch feature config.");
  }
};
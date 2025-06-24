import useApiClient from "@/api/apiClient";

export const fetchCustomizationData = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/app-customization/merchant-app`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching merchant app customization data: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch merchant app customization data"
    );
  }
};

export const updateCustomizationData = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/app-customization/merchant-app`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating merchant app customization data: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to update merchant app customization data"
    );
  }
};

import useApiClient from "@/api/apiClient";

export const fetchCustomizationData = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/app-customization/agent-app`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching agent app customization data: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch agent app customization data"
    );
  }
};

export const updateCustomizationData = async (data, navigate) => {
  try {
    console.log(data);

    const api = useApiClient(navigate);
    const res = await api.post(`/admin/app-customization/agent-app`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating agent app customization data: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to update agent app customization data"
    );
  }
};

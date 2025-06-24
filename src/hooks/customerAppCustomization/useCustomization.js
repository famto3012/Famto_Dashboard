import useApiClient from "@/api/apiClient";

export const fetchCustomizationData = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/app-customization/customer-app`);

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching customer app customization data: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch customer app customization data"
    );
  }
};

export const updateCustomizationData = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/app-customization/customer-app`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating customer app customization data: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to update customer app customization data"
    );
  }
};

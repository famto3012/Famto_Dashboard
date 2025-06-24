import useApiClient from "@/api/apiClient";

export const fetchSettingsData = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/settings`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching settings data: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch settings data."
    );
  }
};

export const updateSettingsData = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/settings/update-settings`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating settings data: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update settings data."
    );
  }
};

export const updatePassword = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(`/settings/change-password`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating password: ${err.response?.data?.message}`);
    throw new Error(
      err.response?.data?.message || "Failed to update password."
    );
  }
};

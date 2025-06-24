import useApiClient from "@/api/apiClient";

export const getAllGeofence = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/geofence/get-geofence`);

    return res.status === 200 ? res.data.geofences : [];
  } catch (err) {
    console.error(`Error in fetching all geofence: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all geofence"
    );
  }
};

export const deleteGeofence = async ({ geofenceId, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/geofence/delete-geofence/${geofenceId}`
    );

    return res.status === 200 ? res.data : {};
  } catch (err) {
    console.error(`Error in deleting geofence: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to delete geofence");
  }
};

export const addGeofence = async ({ newGeofence, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/geofence/add-geofence`, newGeofence);

    navigate("/configure/geofence");
    return res.status === 201 ? res.data : {};
  } catch (err) {
    console.error(`Error in adding geofence: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to add geofence");
  }
};

export const updateGeofence = async ({
  geofenceId,
  updatedGeofence,
  navigate,
}) => {
  try {
    console.log("data", updatedGeofence);
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/geofence/edit-geofence/${geofenceId}`,
      updatedGeofence
    );
    navigate("/configure/geofence");
    return res.status === 200 ? res.data : {};
  } catch (err) {
    console.error(`Error in updating geofence: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to update geofence");
  }
};

export const getGeofenceDetail = async ({ geofenceId, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/geofence/get-geofence/${geofenceId}`);

    return res.status === 200 ? res.data.geofence : {};
  } catch (err) {
    console.error(`Error in getting geofence: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to get geofence");
  }
};

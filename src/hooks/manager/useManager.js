import useApiClient from "@/api/apiClient";

// Manager
export const addManager = async (data, navigate) => {
  try {
    console.log(data);

    const api = useApiClient(navigate);
    const res = await api.post(`/admin/managers/add-manager`, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to add manager.");
  }
};

export const editManager = async (managerId, data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/managers/edit-manager/${managerId}`,
      data
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to edit manager.");
  }
};

export const fetchAllManagers = async (filter, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/managers`, {
      params: {
        geofence: filter?.geofence || null,
        name: filter?.name || "",
      },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.log(`Error in fetching managers: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch managers.");
  }
};

export const fetchSingleManager = async (managerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/managers/${managerId}`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.log(`Error in fetching managers: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch managers.");
  }
};

export const deleteManager = async (managerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(`/admin/managers/delete-manager/${managerId}`);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.log(`Error in fetching managers: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch managers.");
  }
};

// Roles
export const addRole = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/managers/manager-roles`, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to add manager roles."
    );
  }
};

export const editRole = async (roleId, data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/admin/managers/manager-roles/${roleId}`, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to edit manager roles."
    );
  }
};

export const fetchAllRoles = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/managers/manager-roles`);

    return res.status === 200 ? res.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch manager roles."
    );
  }
};

export const fetchSingleRole = async (roleId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/managers/manager-roles/${roleId}`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch single manager roles."
    );
  }
};

export const deleteRole = async (roleId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(`/admin/managers/manager-roles/${roleId}`);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.log(`Error in fetching managers: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete manager role."
    );
  }
};

// Route
export const fetchAllowedRoutes = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/managers/get-allowed-routes`);

    return res.status === 200 ? res.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch allowed routes."
    );
  }
};

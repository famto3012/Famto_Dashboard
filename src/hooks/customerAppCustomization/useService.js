import useApiClient from "@/api/apiClient";

export const fetchAllService = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/service-categories/get-service`);

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching all services: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all services"
    );
  }
};

export const reOrderService = async (categories, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/admin/service-categories/edit-service-order`, {
      categories,
    });

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in re-ordering services: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to re-ordering services"
    );
  }
};

export const createNewService = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/service-categories/add-service`, data, {
      "Content-Type": "multipart/form-data",
    });

    return res.status === 201 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in creating new service: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to creating new service"
    );
  }
};

export const fetchSingleService = async (serviceId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/service-categories/get-service/${serviceId}`
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching service detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch service detail"
    );
  }
};

export const deleteService = async (serviceId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/service-categories/delete-service/${serviceId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting service: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to deleting service"
    );
  }
};

export const updateServiceDetail = async (serviceId, data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/service-categories/edit-service/${serviceId}`,
      data,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in re-ordering services: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to re-ordering services"
    );
  }
};

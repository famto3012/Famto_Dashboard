import useApiClient from "@/api/apiClient";

export const fetchAllTax = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/taxes/all-tax`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all tax: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch all tax.");
  }
};

export const createNewTax = async (taxData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/taxes/add-tax`, taxData);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new tax: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to create tax.");
  }
};

export const toggleTaxStatus = async (taxId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/taxes/change-status/${taxId}`, {});

    return res.status === 200 ? res.data.message : [];
  } catch (err) {
    console.error(`Error in updating tax status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update tax status"
    );
  }
};

export const getTaxDetail = async (taxId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/taxes/${taxId}`);

    return res.status === 200 ? res.data.data : {};
  } catch (err) {
    console.error(`Error in fetching tax detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch tax detail"
    );
  }
};

export const editTaxDetail = async (taxId, taxData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/admin/taxes/edit-tax/${taxId}`, taxData);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching tax detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch tax detail"
    );
  }
};

export const deleteTax = async (taxId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(`/admin/taxes/delete-tax/${taxId}`);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting tax detail: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to delete tax");
  }
};

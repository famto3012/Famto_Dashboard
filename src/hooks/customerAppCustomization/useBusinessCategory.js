import useApiClient from "@/api/apiClient";

export const fetchBusinessCategoryOfMerchant = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/categories/${merchantId}/business-categories`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch all business category of merchant"
    );
  }
};

export const getAllBusinessCategory = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/business-categories/get-all-business-category`
    );

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all business categories: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all business category"
    );
  }
};

export const createNewBusinessCategory = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/business-categories/add-business-category`,
      data
    );

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new business category: ${err}`);
    throw (
      err.response?.data?.errors || {
        message: "Failed to create new business category",
      }
    );
  }
};

export const updateBusinessCategoryStatus = async (categoryId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/admin/business-categories/change-status/${categoryId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating business category status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update business category status"
    );
  }
};

export const updateBusinessCategoryDetail = async (
  categoryId,
  data,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/business-categories/edit-business-category/${categoryId}`,
      data
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to update business category",
      }
    );
  }
};

export const updateBusinessCategoryOrder = async (categories, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/business-categories/edit-business-category-order`,
      categories
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating business category order: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update business category order"
    );
  }
};

export const fetchSingleBusinessCategory = async (categoryId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/business-categories/${categoryId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching business category detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch business category detail"
    );
  }
};

export const deleteBusinessCategory = async (categoryId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/business-categories/delete-business-category/${categoryId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting business category: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete business category"
    );
  }
};

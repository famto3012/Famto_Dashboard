import useApiClient from "@/api/apiClient";

export const fetchAllCustomOrderBanners = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/custom-order-banner/get-custom-order-banner`
    );

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all custom order banners: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all custom order banners"
    );
  }
};

export const fetchSingleCustomOrderBanner = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/custom-order-banner/get-custom-order-banner/${bannerId}`
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching custom order banner detail: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch custom order banner detail"
    );
  }
};

export const createNewCustomOrderBanner = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/custom-order-banner/add-custom-order-banner`,
      data
    );

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new custom order banner: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to create new custom order banner"
    );
  }
};

export const updateCustomOrderBannerDetail = async (
  bannerId,
  data,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/custom-order-banner/edit-custom-order-banner/${bannerId}`,
      data
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating custom order banner detail: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to update custom order banner detail"
    );
  }
};

export const updateAllCustomOrderBannerStatus = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/custom-order-banner/custom-order-banner-status`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating custom order banner status: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to update custom order banner status"
    );
  }
};

export const deleteCustomOrderBanner = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/custom-order-banner/delete-custom-order-banner/${bannerId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting custom order banner detail: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to delete custom order banner detail"
    );
  }
};

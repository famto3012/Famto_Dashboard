import useApiClient from "@/api/apiClient";

export const fetchAllPickAndDropBanners = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/pick-and-drop-banner/get-pick-drop-banner`
    );

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all pick and drop order banners: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch all pick and drop order banners"
    );
  }
};

export const fetchSinglePickAndDropBanner = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/pick-and-drop-banner/get-pick-drop-banner/${bannerId}`
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(
      `Error in fetching pick and drop order banner detail: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch pick and drop order banner detail"
    );
  }
};

export const createNewPickAndDropBanner = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/pick-and-drop-banner/add-pick-drop-banner`,
      data
    );

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new pick and drop order banner: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to create new pick and drop order banner"
    );
  }
};

export const updatePickAndDropBannerDetail = async (
  bannerId,
  data,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/pick-and-drop-banner/edit-pick-drop-banner/${bannerId}`,
      data
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(
      `Error in updating pick and drop order banner detail: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to update pick and drop order banner detail"
    );
  }
};

export const updateAllPickAndDropBannerStatus = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/pick-and-drop-banner/pick-drop-banner-status`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(
      `Error in updating pick and drop order banner status: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to update pick and drop order banner status"
    );
  }
};

export const deletePickAndDropBanner = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/pick-and-drop-banner/delete-pick-drop-banner/${bannerId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(
      `Error in deleting pick and drop order banner detail: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to delete pick and drop order banner detail"
    );
  }
};

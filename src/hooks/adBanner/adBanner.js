import useApiClient from "@/api/apiClient";

// Individual Merchant Banner
// ===================
export const fetchAllIndividualBanner = async (merchantId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/banner/get-banner/merchant/${merchantId}`
    );
console.log("banner",res);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all merchant banners: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all merchant banners"
    );
  }
};

export const createNewIndividualBanner = async (bannerData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/banner/add-banner`, bannerData, {
      "Content-Type": "multipart/form-data",
    });

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.errors || {
        message: "Failed to update new merchant banner",
      }
    );
  }
};

export const fetchSingleIndividualBanner = async (bannerId, navigate) => {
  try {
    console.log(bannerId);
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/banner/get-banner/${bannerId}`);

    console.log(res.data);
    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching merchant banner detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch merchant banner detail"
    );
  }
};

export const updateIndividualBannerStatus = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/admin/banner/banner-status/${bannerId}`);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating merchant banner status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update merchant banner status"
    );
  }
};

export const updateIndividualBannerDetail = async (
  bannerId,
  bannerData,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/banner/edit-banner/${bannerId}`,
      bannerData,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating merchant banner status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update merchant banner status"
    );
  }
};

export const deleteIndividualBanner = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(`/admin/banner/delete-banner/${bannerId}`);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting merchant banner: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete merchant banner"
    );
  }
};

// App Ad Banner
// ===================
export const fetchAllAppBanner = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/app-banner/get-app-banner`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all app banners: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all app banners"
    );
  }
};

export const createNewAppBanner = async (bannerData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/app-banner/add-app-banner`, bannerData, {
      "Content-Type": "multipart/form-data",
    });

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new merchant banner: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update new merchant banner"
    );
  }
};

export const fetchSingleAppBanner = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/app-banner/get-app-banner/${bannerId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching merchant banner detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch merchant banner detail"
    );
  }
};

export const updateAppBannerStatus = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/app-banner/app-banner-status/${bannerId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating merchant banner status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update merchant banner status"
    );
  }
};

export const updateAppBannerDetail = async (bannerId, bannerData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/app-banner/edit-app-banner/${bannerId}`,
      bannerData,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating merchant banner status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update merchant banner status"
    );
  }
};

export const deleteAppBanner = async (bannerId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/app-banner/delete-app-banner/${bannerId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting merchant banner: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete merchant banner"
    );
  }
};

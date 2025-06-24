import useApiClient from "@/api/apiClient";

export const fetchAllPromoCodes = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/promocode/get-promocode`);
    console.log("hai",res);
    return res.status === 200 ? res.data : [];

    
  } catch (err) {
    console.error(`Error in fetching all promo codes: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all promo codes."
    );
  }
};

export const createNewPromoCode = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/promocode/add-promocode`, data, {
      "Content-Type": "multipart/form-data",
    });

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new promo code: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to create new promo code."
    );
  }
};

export const fetchPromoCodeDetail = async (promoCodeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/promocode/${promoCodeId}`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching promo code detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch promo code detail."
    );
  }
};

export const updatePromoCodeDetail = async (promocodeId, data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/promocode/edit-promocode/${promocodeId}`,
      data,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating promo code detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update promo code detail."
    );
  }
};

export const updatePromoCodeStatus = async (promocodeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/promocode/edit-promocode-status/${promocodeId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating promo code status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update promo code status."
    );
  }
};

export const deletePromoCodes = async (promocodeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/promocode/delete-promocode/${promocodeId}`
    );

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in deleting promo codes: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete promo codes."
    );
  }
};

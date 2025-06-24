import useApiClient from "@/api/apiClient";

export const fetchReferralData = async (referralType, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/referrals/referral-criteria`, {
      params: { referralType },
    });

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching referral data: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch referral data ."
    );
  }
};

export const updateReferralData = async (referralData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/referrals/add-referral`, referralData);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating referral data: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update referral data ."
    );
  }
};

export const updateReferralStatus = async (referralType, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/referrals/edit-referral-status`,
      {},
      {
        params: { referralType },
      }
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in updating referral status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update referral status ."
    );
  }
};

export const fetchReferralTableData = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/referrals/referral-detail`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching referral table data: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch referral table data ."
    );
  }
};

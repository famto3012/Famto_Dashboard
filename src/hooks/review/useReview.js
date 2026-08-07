import useApiClient from "@/api/apiClient";

export const fetchMerchantReviews = async (page, limit, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/reviews", {
      params: { page, limit },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching merchant reviews: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch reviews"
    );
  }
};

export const replyToReview = async (customerId, reply, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(`/merchants/reviews/${customerId}/reply`, {
      reply,
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in replying to review: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to submit reply"
    );
  }
};

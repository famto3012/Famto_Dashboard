import useApiClient from "@/api/apiClient";

// =====================================
// ==============Merchant===============
// =====================================
export const fetchAllSubscriptionPlansOfMerchant = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/subscription/get-merchant-subscription`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(
      `Error in fetching all subscription plans of merchant: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch all subscription plans of merchant"
    );
  }
};

export const createMerchantSubscriptionPlan = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/subscription/add-merchant-subscription`,
      data
    );

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(
      `Error in creating new subscription plan of merchant: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to create new subscription plan of merchant"
    );
  }
  s;
};

export const fetchSingleMerchantSubscriptionPlan = async (planId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/subscription/get-merchant-subscription/${planId}`
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(
      `Error in fetching detail subscription plan of merchant: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch detail of subscription plan of merchant"
    );
  }
  s;
};

export const updateMerchantSubscriptionPlan = async (
  planId,
  data,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/subscription/edit-merchant-subscription/${planId}`,
      data
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating subscription plan of merchant: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to update subscription plan of merchant"
    );
  }
  s;
};

export const deleteMerchantSubscriptionPlan = async (planId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/subscription/delete-merchant-subscription/${planId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting subscription plan of merchant: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to delete subscription plan of merchant"
    );
  }
};

export const initiateSubscriptionPaymentForMerchant = async (
  role,
  data,
  navigate
) => {
  try {
    const endPoint =
      role === "Merchant"
        ? `/admin/subscription-payment/merchant-subscription-payment-user`
        : `/admin/subscription-payment/merchant-subscription-payment`;

    const api = useApiClient(navigate);
    const res = await api.post(endPoint, data);

    return res.status === 201 ? res.data : null;
  } catch (err) {
    console.error(
      `Error initiating subscription plan payment for merchant: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to initiate subscription plan payment for merchant"
    );
  }
};

export const verifyRazorpayPaymentForSubscription = async (
  orderId,
  amount,
  currentPlan,
  paymentMode,
  userId,
  navigate
) => {
  try {
    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "Famto",
      description: "Subscription Payment",
      order_id: orderId,
      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;

        const endPoint = `/admin/subscription-payment/merchant-subscription-payment-verification`;

        const data = {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          currentPlan,
          paymentMode,
          userId,
        };

        const api = useApiClient(navigate);
        const res = await api.post(endPoint, data);

        return res.status === 200 ? res.data.message : null;
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#00CED1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(
      `Error in verifying subscription plan payment of merchant: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to verify subscription plan payment of merchant"
    );
  }
};

export const fetchMerchantSubscriptionLogs = async (
  page,
  limit,
  filter,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/subscription-payment/all-merchant-subscription-log`,
      {
        params: {
          page,
          limit,
          merchantId: filter.merchantId,
          merchantName: filter.name,
          date: filter.date,
          status: filter.status,
        },
      }
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching subscription logs merchant: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch subscription logs of merchant"
    );
  }
};

export const updatePaymentStatusOfSubscription = async (logId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/subscription-payment/merchant-subscription-status-update/${logId}`,
      {}
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(
      `Error in updating subscription logs status of merchant: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to update subscription log status of merchant"
    );
  }
};

export const fetchCurrentSubscriptionPlan = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/subscription/get-current-subscription`);

    console.log(res.data);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch current subscription plan of merchant"
    );
  }
};

// =====================================
// ==============Customer===============
// =====================================
export const fetchAllSubscriptionPlansOfCustomer = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/subscription/get-customer-subscription`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(
      `Error in fetching all subscription plans of customer: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch all subscription plans of customer"
    );
  }
};

export const createCustomerSubscriptionPlan = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/subscription/add-customer-subscription`,
      data
    );

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(
      `Error in creating new subscription plan of customer: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to create new subscription plan of customer"
    );
  }
  s;
};

export const fetchSingleCustomerSubscriptionPlan = async (planId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/subscription/get-customer-subscription/${planId}`
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(
      `Error in fetching detail subscription plan of customer: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch detail of subscription plan of customer"
    );
  }
  s;
};

export const updateCustomerSubscriptionPlan = async (
  planId,
  data,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/subscription/edit-customer-subscription/${planId}`,
      data
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating subscription plan of customer: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to update subscription plan of customer"
    );
  }
  s;
};

export const deleteCustomerSubscriptionPlan = async (planId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/subscription/delete-customer-subscription/${planId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting subscription plan of customer: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to delete subscription plan of customer"
    );
  }
  s;
};

export const initiateSubscriptionPaymentForCustomer = async (
  data,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/subscription-payment/customer-subscription-payment`,
      data
    );

    return res.status === 201 ? res.data : null;
  } catch (err) {
    console.error(
      `Error initiating subscription plan payment for customer: ${err}`
    );
    throw new Error(
      err.response?.data?.message ||
        "Failed to initiate subscription plan payment for customer"
    );
  }
};

export const fetchCustomerSubscriptionLogs = async (
  page,
  limit,
  filter,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/subscription-payment/all-customer-subscription-log`,
      {
        params: {
          page,
          limit,
          name: filter.name,
          date: filter.date,
        },
      }
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching subscription logs customer: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch subscription logs of customer"
    );
  }
};

import useApiClient from "@/api/apiClient";

// Merchant Razorpay/Cashfree/PhonePe payment config + wallet.
// Endpoints under /merchants/* (payment-config, wallet). Secrets never returned.

export const fetchPaymentConfig = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/payment-config");

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching payment config: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch payment config"
    );
  }
};

export const updatePaymentConfig = async (payload, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put("/merchants/payment-config", payload);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in updating payment config: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to save payment config"
    );
  }
};

export const testPaymentConfig = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post("/merchants/payment-config/test", {});

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in testing payment config: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to test payment config"
    );
  }
};

export const disablePaymentConfig = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete("/merchants/payment-config");

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in disabling payment config: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to disable payment config"
    );
  }
};

export const fetchMerchantWallet = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/wallet");

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching wallet: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch wallet"
    );
  }
};

export const requestPayout = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post("/merchants/wallet/payout", {});

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in requesting payout: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to request payout"
    );
  }
};
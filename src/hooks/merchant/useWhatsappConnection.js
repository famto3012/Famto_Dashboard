import useApiClient from "@/api/apiClient";

// Merchant OwnWABA connection — save own Meta credentials + test against Meta.
// Endpoints: GET/PUT /merchant/whatsapp/connection, POST .../connection/test

export const fetchMerchantConnection = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchant/whatsapp/connection");

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching merchant connection: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch WhatsApp connection"
    );
  }
};

export const saveMerchantConnection = async (payload, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put("/merchant/whatsapp/connection", payload);

    return res.status === 200 || res.status === 201 ? res.data : null;
  } catch (err) {
    console.error(`Error in saving merchant connection: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to save WhatsApp connection"
    );
  }
};

export const testMerchantConnection = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post("/merchant/whatsapp/connection/test", {});

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in testing merchant connection: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to test WhatsApp connection"
    );
  }
};

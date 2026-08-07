import useApiClient from "@/api/apiClient";

export const fetchQrConfig = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchants/qr-config");

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching QR config: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch QR config"
    );
  }
};

export const updateQrConfig = async (qrUrl, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put("/merchants/qr-config", { qrUrl });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in updating QR config: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update QR config"
    );
  }
};

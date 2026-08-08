import useApiClient from "@/api/apiClient";

// Merchant WhatsApp campaigns — list/create/send + template & contact pickers.
// Endpoints under /merchant/whatsapp/* (scoped to the merchant's own connection).

export const fetchMerchantCampaigns = async ({ page = 1, limit = 20 }, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchant/whatsapp/campaigns", {
      params: { page, limit },
    });

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching merchant campaigns: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch campaigns"
    );
  }
};

export const createMerchantCampaign = async (payload, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post("/merchant/whatsapp/campaigns", payload);

    return res.status === 201 ? res.data : null;
  } catch (err) {
    console.error(`Error in creating merchant campaign: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to create campaign"
    );
  }
};

export const sendMerchantCampaign = async (campaignId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/merchant/whatsapp/campaigns/${campaignId}/send`, {});

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in sending merchant campaign: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to send campaign"
    );
  }
};

export const fetchMerchantCampaignEvents = async (campaignId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/merchant/whatsapp/campaigns/${campaignId}/events`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching merchant campaign events: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch campaign events"
    );
  }
};

export const fetchMerchantTemplates = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchant/whatsapp/templates");

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching merchant templates: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch templates"
    );
  }
};

export const fetchMerchantContacts = async (
  { search = "", page = 1, limit = 50 },
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get("/merchant/whatsapp/contacts", {
      params: { search, page, limit },
    });

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching merchant contacts: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch contacts"
    );
  }
};

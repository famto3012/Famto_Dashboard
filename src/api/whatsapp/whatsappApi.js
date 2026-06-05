import createApiClient from "@/api/apiClient";

const PAGE_SIZE = 20;

const getPayload = (response) => {
  return response?.data?.data ?? response?.data ?? null;
};

const toPaginated = (payload) => {
  const source = payload?.data ?? payload;

  if (Array.isArray(source)) {
    return { items: source, nextPage: null, total: source.length };
  }

  const items = source?.items ?? source?.messages ?? source?.conversations ?? [];

  return {
    items,
    nextPage: source?.nextPage ?? source?.next ?? null,
    total: source?.total ?? items.length,
  };
};

// Static data that doesn't come from an API endpoint
const defaultTags = [
  { id: "vip", label: "VIP", color: "emerald" },
  { id: "new", label: "New", color: "sky" },
  { id: "order-issue", label: "Order Issue", color: "rose" },
  { id: "cod", label: "COD", color: "amber" },
  { id: "campaign", label: "Campaign", color: "violet" },
];

export const whatsappApi = {
  agents: () => [],
  tags: () => defaultTags,

  async overview(navigate) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/overview");
    return getPayload(response);
  },

  async conversations(navigate, params = {}) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/conversations", { params });
    const payload = getPayload(response);
    return toPaginated(payload);
  },

  async legacyConversations(navigate) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/conversations");
    const payload = getPayload(response);
    return payload?.items ?? payload ?? [];
  },

  async messages(navigate, conversationId, params = {}) {
    const api = createApiClient(navigate);
    const response = await api.get(`/whatsapp/conversations/${conversationId}/messages`, { params });
    const payload = getPayload(response);
    return toPaginated(payload);
  },

  async legacyMessages(navigate, waId) {
    const api = createApiClient(navigate);
    const response = await api.get(`/whatsapp/message/${waId}`);
    return getPayload(response) ?? [];
  },

  async sendMessage(navigate, conversationId, payload) {
    const api = createApiClient(navigate);
    const body =
      payload instanceof FormData
        ? payload
        : buildMessageFormData({ ...payload, conversationId });

    const response = await api.post(`/whatsapp/conversations/${conversationId}/messages`, body);
    return getPayload(response);
  },

  async sendTemplate(navigate, conversationId, payload) {
    const api = createApiClient(navigate);
    const response = await api.post(`/whatsapp/conversations/${conversationId}/templates`, payload);
    return getPayload(response);
  },

  async updateConversation(navigate, conversationId, payload) {
    const api = createApiClient(navigate);
    const response = await api.patch(`/whatsapp/conversations/${conversationId}`, payload);
    return getPayload(response);
  },

  async addNote(navigate, conversationId, payload) {
    const api = createApiClient(navigate);
    const response = await api.post(`/whatsapp/conversations/${conversationId}/notes`, payload);
    return getPayload(response);
  },

  async contacts(navigate, params = {}) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/contacts", { params });
    return getPayload(response) ?? [];
  },

  async contactTags(navigate) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/contacts/tags");
    return getPayload(response) ?? [];
  },

  async syncFromFamtoCustomers(navigate) {
    const api = createApiClient(navigate);
    const response = await api.post("/whatsapp/contacts/sync-famto");
    return getPayload(response);
  },

  async importContactsCsv(navigate, file) {
    const api = createApiClient(navigate);
    const formData = new FormData();
    formData.append("csv", file);
    const response = await api.post("/whatsapp/contacts/import-csv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return getPayload(response);
  },

  downloadSampleCsv(navigate) {
    const api = createApiClient(navigate);
    return api.get("/whatsapp/contacts/sample-csv", { responseType: "blob" });
  },

  async campaigns(navigate) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/campaigns");
    return getPayload(response) ?? [];
  },

  async createCampaign(navigate, payload) {
    const api = createApiClient(navigate);
    const response = await api.post("/whatsapp/campaigns", payload);
    return getPayload(response);
  },

  async templates(navigate, params = {}) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/templates", { params });
    return getPayload(response) ?? [];
  },

  async syncTemplates(navigate) {
    const api = createApiClient(navigate);
    const response = await api.post("/whatsapp/templates/sync");
    return getPayload(response);
  },

  async analytics(navigate, params = {}) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/analytics", { params });
    return getPayload(response);
  },

  async wallet(navigate) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/wallet");
    return getPayload(response);
  },

  async rechargeWallet(navigate, payload) {
    const api = createApiClient(navigate);
    const response = await api.post("/whatsapp/wallet/recharge", payload);
    return getPayload(response);
  },

  async businessProfile(navigate) {
    const api = createApiClient(navigate);
    const response = await api.get("/whatsapp/business-profile");
    return getPayload(response);
  },

  async updateBusinessProfile(navigate, payload) {
    const api = createApiClient(navigate);
    const response = await api.patch("/whatsapp/business-profile", payload);
    return getPayload(response);
  },
};

export const buildMessageFormData = (payload = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "file") {
      formData.append(payload.messageType || payload.type || "media", value);
      return;
    }

    if (typeof value === "object" && !(value instanceof Blob)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

export const getWhatsappApiErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong while communicating with WhatsApp services.";

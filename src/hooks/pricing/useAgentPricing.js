import useApiClient from "@/api/apiClient";

// Agent Pricing
// ================
export const fetchAllAgentPricing = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agent-pricing/get-all-agent-pricing`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all agent pricing: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all agent pricing."
    );
  }
};

export const updateAgentPricingStatus = async (pricingId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/agent-pricing/change-status/${pricingId}`,
      {}
    );

    return res.status === 200 ? res.data.message : [];
  } catch (err) {
    console.error(`Error in updating agent pricing status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update agent pricing status."
    );
  }
};

export const createNewAgentPricing = async (pricingData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/agent-pricing/add-agent-pricing`,
      pricingData
    );

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating agent pricing status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update agent pricing status."
    );
  }
};

export const getSingleAgentPricing = async (pricingId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agent-pricing/${pricingId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in getting agent pricing: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch agent pricing detail."
    );
  }
};

export const editAgentPricing = async (pricingId, pricingData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/agent-pricing/edit-agent-pricing/${pricingId}`,
      pricingData
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in getting agent pricing: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch agent pricing detail."
    );
  }
};

export const deleteAgentPricing = async (pricingId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/agent-pricing/delete-agent-pricing/${pricingId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting agent pricing: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete agent pricing."
    );
  }
};

// Agent Surge
// ================
export const fetchAllAgentSurge = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agent-surge/get-all-agent-surge`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all agent surge: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all agent surge."
    );
  }
};

export const updateAgentSurgeStatus = async (surgeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/agent-surge/change-status/${surgeId}`,
      {}
    );

    return res.status === 200 ? res.data.message : [];
  } catch (err) {
    console.error(`Error in updating agent surge status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update agent surge status."
    );
  }
};

export const createNewAgentSurge = async (surgeData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/agent-surge/add-agent-surge`, surgeData);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating agent surge status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update agent surge status."
    );
  }
};

export const getSingleAgentSurge = async (surgeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agent-surge/${surgeId}`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in getting agent surge: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch agent surge detail."
    );
  }
};

export const editAgentSurge = async (surgeId, surgeData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/agent-surge/edit-agent-surge/${surgeId}`,
      surgeData
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in updating agent surge: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update agent surge detail."
    );
  }
};

export const deleteAgentSurge = async (surgeId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/agent-surge/delete-agent-surge/${surgeId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting agent surge: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete agent surge."
    );
  }
};

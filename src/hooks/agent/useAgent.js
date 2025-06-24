import useApiClient from "@/api/apiClient";

export const fetchAllAgents = async (filter, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agents/filter`, {
      params: {
        geofence: filter?.geofence,
        status: filter?.status,
        vehicleType: filter?.vehicleType,
        name: filter?.name,
      },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching all agents: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all agents"
    );
  }
};

export const updateAgentStatus = async (agentId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(`/admin/agents/change-status/${agentId}`, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating agent status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update agent status"
    );
  }
};

export const createNewAgent = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/agents/add-agents`, data, {
      "Content-Type": "multipart/form-data",
    });

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new agent: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to create new agent"
    );
  }
};

export const fetchSingleAgent = async (agentId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agents/${agentId}`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in fetching agent detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch agent detail"
    );
  }
};

export const fetchRatingsOfAgent = async (agentId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/agents/${agentId}/get-ratings-by-customer`
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching agent ratings: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch agent ratings"
    );
  }
};

export const blockAgent = async (agentId, reason, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(`/admin/agents/block-agent/${agentId}`, {
      reason,
    });

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in blocking agents: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to block agents");
  }
};

export const approveAgent = async (agentId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/admin/agents/approve-registration/${agentId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    // console.error(`Error in approving agents: ${JSON.stringify(err.response)}`);
    throw new Error(err.response?.data || "Failed to approve agents");
  }
};

export const rejectAgent = async (agentId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/agents/reject-registration/${agentId}`
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in blocking agents: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to block agents");
  }
};

export const updateAgentDetail = async (agentId, agentData, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/agents/edit-agent/${agentId}`,
      agentData,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating agent detail: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update agent detail"
    );
  }
};

export const updateAgentVehicle = async (
  agentId,
  vehicleId,
  data,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/admin/agents/edit-agent-vehicle/${agentId}/${vehicleId}`,
      data,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating agent vehicle: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update agent's vehicle"
    );
  }
};

export const fetchAgentPayout = async (filter, page, limit, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agents/filter-payment`, {
      params: {
        page,
        limit,
        status: filter?.status,
        agent: filter?.agent,
        geofence: filter?.geofence,
        date: filter?.date,
        name: filter?.name,
      },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch agent payout";
  }
};

export const approveAgentPayout = async (agentId, detailId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.patch(
      `/admin/agents/approve-payout/${agentId}/${detailId}`,
      {}
    );

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw (
      err.response?.data?.message || {
        message: "Failed to update agent's payout",
      }
    );
  }
};

export const downloadPayoutCSV = async (filter, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agents/download-payment-csv`, {
      params: {
        status: filter?.status,
        agent: filter?.agent,
        geofence: filter?.geofence,
        date: filter?.date,
        name: filter?.name,
      },
      responseType: "blob",
    });

    return res.status === 200 ? res.data : {};
  } catch (err) {
    throw err.response?.data?.message || "Failed to download agent payout CSV";
  }
};

export const downloadAgentCSV = async (filter, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/agents/download-agent-csv`, {
      params: {
        geofence: filter?.geofence,
        status: filter?.status,
        vehicleType: filter?.vehicleType,
        name: filter?.name,
      },
      responseType: "blob",
    });

    return res.status === 200 ? res.data : {};
  } catch (err) {
    throw err.response?.data?.message || "Failed to download agent payout CSV";
  }
};

export const fetchAgentAppTimings = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/app-customization/agent-app-timing`);

    return res.status === 200 ? res.data : [];
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch agent app timings";
  }
};

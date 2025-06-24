import useApiClient from "@/api/apiClient";

export const fetchAllWhatsappConversation = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/whatsapp/message`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all whatsapp conversation: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch all whatsapp conversation."
    );
  }
};

export const fetchAllWhatsappMessagesById = async (waId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/whatsapp/message/${waId}`);

    return res.status === 200 ? res.data.data : {};
  } catch (err) {
    console.error(`Error in fetching all whatsapp messages by id: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to fetch all whatsapp messages by id."
    );
  }
};

export const sendWhatsappMessage = async (data, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/whatsapp/send-message`, data);

    return res.status === 200 ? res.data.data : {};
  } catch (err) {
    console.error(`Error in sending whatsapp messages: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to send whatsapp messages."
    );
  }
};

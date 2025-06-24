import useApiClient from "@/api/apiClient";

export const getNotificationLog = async ({ role, page, limit, navigate }) => {
  try {
    const api = useApiClient(navigate);

    const route =
      role === "Merchant"
        ? "/admin/notification/get-merchant-notification-log"
        : "/admin/notification/get-admin-notification-log";
    const res = await api.get(route, {
      params: {
        page,
        limit,
      },
    });
    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching notification log: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch notification log."
    );
  }
};

export const addNotificationSettings = async ({
  notificationSettings,
  navigate,
}) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/notification/notification-setting`,
      notificationSettings
    );
    return res.status === 201 ? res.data : [];
  } catch (err) {
    console.error(`Error in adding notification settings: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to add notification settings."
    );
  }
};

export const getAllNotificationSettings = async (navigate) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.get("/admin/notification/notification-setting");
    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching notification settings: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch notification settings."
    );
  }
};

export const updateNotificationSettingsStatus = async ({
  navigate,
  notificationId,
  notificationSettings,
}) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.put(
      `/admin/notification/notification-setting-status/${notificationId}`,
      notificationSettings
    );
    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in updating notification settings status: ${err}`);
    throw new Error(
      err.response?.data?.message ||
        "Failed to update notification settings status."
    );
  }
};

export const getSingleNotificationSettings = async (
  navigate,
  notificationId
) => {
  console.log("notificationId", notificationId);
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/admin/notification/notification-setting/${notificationId}`
    );
    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching notification settings: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch notification settings."
    );
  }
};

export const updateNotificationSettings = async ({
  navigate,
  notificationId,
  notificationSettings,
}) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.put(
      `/admin/notification/notification-setting/${notificationId}`,
      notificationSettings
    );
    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in updating notification settings: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update notification settings."
    );
  }
};

export const deleteNotificationSettings = async ({
  navigate,
  notificationSettingsId,
}) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/notification/notification-setting/${notificationSettingsId}`
    );
    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in deleting notification settings: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete notification settings."
    );
  }
};

export const sendPushNotifications = async ({ selectedId, navigate }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/notification/send-push-notification/${selectedId}`,
      {}
    );
    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in sending push notification: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to send push notification."
    );
  }
};

export const addPushNotifications = async ({
  addPushNotification,
  navigate,
}) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/notification/push-notification`,
      addPushNotification
    );
    return res.status === 201 ? res.data : {};
  } catch (err) {
    console.error(`Error in adding push notification: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to add push notification."
    );
  }
};

export const deletePushNotification = async ({ navigate, selectedId }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/notification/push-notification/${selectedId}`
    );
    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in deleting push notification: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete push notification."
    );
  }
};

export const filterPushNotification = async (navigate, selectedType) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.get("/admin/notification/filter-push-notification", {
      params: selectedType,
    });
    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching push notification: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch push notification."
    );
  }
};

export const addAlertNotifications = async ({
  alertNotification,
  navigate,
}) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/admin/notification/alert-notification`,
      alertNotification
    );
    return res.status === 201 ? res.data : {};
  } catch (err) {
    console.error(`Error in adding alert notification: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to add alert notification."
    );
  }
};

export const deleteAlertNotification = async ({ navigate, selectedId }) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.delete(
      `/admin/notification/alert-notification/${selectedId}`
    );
    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in deleting alert notification: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete alert notification."
    );
  }
};

export const filterAlertNotification = async (navigate, selectedType) => {
  try {
    const api = useApiClient(navigate);

    const res = await api.get("/admin/notification/filter-alert-notification", {
      params: selectedType,
    });
    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching alert notification: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch alert notification."
    );
  }
};

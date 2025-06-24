import axios from "axios";
import { EncryptStorage } from "encrypt-storage";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const secretKey = import.meta.env.VITE_APP_LOCALSTORAGE_KEY;

const encryptStorage = new EncryptStorage(secretKey, {
  prefix: "FAMTO",
});

let isNavigating = false;
let isRefreshingToken = false;
let requestQueue = [];

// Check if the token is expired or nearing expiration (e.g., within 1 minute)
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return exp - currentTime < 60; // Less than 1 minute to expire
  } catch (error) {
    return true;
  }
};

const processQueue = (error, token = null) => {
  requestQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  requestQueue = [];
};

const refreshAccessToken = async () => {
  if (isRefreshingToken) {
    // Wait for the ongoing refresh to complete
    return new Promise((resolve, reject) => {
      requestQueue.push({ resolve, reject });
    });
  }

  isRefreshingToken = true;

  try {
    const refreshToken = encryptStorage.getItem("refreshToken");

    if (!refreshToken) {
      await clearStorage();
      processQueue("Refresh token not found");
      return null;
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const { newToken, newRefreshToken } = response.data;

    encryptStorage.setItem("token", newToken);

    if (newRefreshToken) {
      encryptStorage.setItem("refreshToken", newRefreshToken);
    }

    isRefreshingToken = false;
    processQueue(null, newToken);
    return newToken;
  } catch (error) {
    isRefreshingToken = false;
    processQueue(error);
    isNavigating = true;
    await clearStorage();
    return null;
  }
};

const clearStorage = async () => {
  await encryptStorage.removeItem("token");
  await encryptStorage.removeItem("role");
  await encryptStorage.removeItem("userId");
  await encryptStorage.removeItem("fcmToken");
  await encryptStorage.removeItem("username");
  await encryptStorage.removeItem("refreshToken");
};

const checkAndRefreshToken = async () => {
  const token = encryptStorage.getItem("token");

  if (isTokenExpired(token)) {
    return await refreshAccessToken();
  }

  return token;
};

const useApiClient = (navigate) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const latestToken = await checkAndRefreshToken();

      if (latestToken) {
        config.headers["Authorization"] = `Bearer ${latestToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosInstance(error.config);
          } else {
            if (!isNavigating) {
              await clearStorage();
              isNavigating = true;
              navigate("/auth/sign-in");
            }
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useApiClient;

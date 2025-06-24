import { createContext, useEffect, useState } from "react";
import { EncryptStorage } from "encrypt-storage";

const secretKey = import.meta.env.VITE_APP_LOCALSTORAGE_KEY;

const encryptStorage = new EncryptStorage(secretKey, {
  prefix: "FAMTO",
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(encryptStorage.getItem("token") || null);
  const [role, setRole] = useState(encryptStorage.getItem("role") || null);
  const [username, setUsername] = useState(
    encryptStorage.getItem("username") || null
  );
  const [userId, setUserId] = useState(
    encryptStorage.getItem("userId") || null
  );
  const [fcmToken, setFcmToken] = useState(
    encryptStorage.getItem("fcmToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    encryptStorage.getItem("refreshToken") || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const saveToStorage = (
    accessToken,
    role,
    userId,
    username,
    fcmToken,
    newRefreshToken
  ) => {
    try {
      setIsLoading(true);

      encryptStorage.setItem("token", accessToken);
      encryptStorage.setItem("role", role);
      encryptStorage.setItem("userId", userId);
      encryptStorage.setItem("username", username);
      encryptStorage.setItem("fcmToken", fcmToken);
      encryptStorage.setItem("refreshToken", newRefreshToken);

      setToken(accessToken);
      setRole(role);
      setUserId(userId);
      setUsername(username);
      setFcmToken(fcmToken);
      setRefreshToken(newRefreshToken);
    } catch (error) {
      console.error("Error saving tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFcmTokenToStorage = (fcmToken) => {
    try {
      setIsLoading(true);

      encryptStorage.setItem("fcmToken", fcmToken);
      setFcmToken(fcmToken);
    } catch (error) {
      console.error("Error saving FCM token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load tokens from secure storage
  const loadTokens = () => {
    try {
      setIsLoading(true);

      const storedToken = encryptStorage.getItem("token");
      const storedRole = encryptStorage.getItem("role");
      const storedUsername = encryptStorage.getItem("username");
      const storedUserId = encryptStorage.getItem("userId");
      const storedFcmToken = encryptStorage.getItem("fcmToken");
      const storedRefreshToken = encryptStorage.getItem("refreshToken");

      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);
        setUsername(storedUsername);
        setUserId(storedUserId);
        setFcmToken(storedFcmToken);
        setRefreshToken(storedRefreshToken);
      }
    } catch (error) {
      console.error("Error loading tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear storage
  const clearStorage = () => {
    try {
      setIsLoading(true);

      encryptStorage.removeItem("token");
      encryptStorage.removeItem("role");
      encryptStorage.removeItem("userId");
      encryptStorage.removeItem("fcmToken");
      encryptStorage.removeItem("username");
      encryptStorage.removeItem("refreshToken");

      setToken(null);
      setRole(null);
      setUserId(null);
      setUsername(null);
      setFcmToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        username,
        userId,
        fcmToken,
        refreshToken,
        saveToStorage,
        clearStorage,
        isLoading,
        saveFcmTokenToStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

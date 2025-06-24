import { EncryptStorage } from "encrypt-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const secretKey = import.meta.env.VITE_APP_LOCALSTORAGE_KEY;

const encryptStorage = new EncryptStorage(secretKey, {
  prefix: "FAMTO",
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    encryptStorage.getItem("userId") || null
  );
  const [fcmToken, setFcmToken] = useState(
    encryptStorage.getItem("fcmToken") || null
  );

  const [socket, setSocket] = useState(null);

  const updateFcmToken = (token) => {
    encryptStorage.setItem("fcmToken", token);
    setFcmToken(token);
  };

  useEffect(() => {
    if (userId && fcmToken) {
      const newSocket = io("https://development.famto.in", {
        query: {
          userId: userId && userId,
          fcmToken: fcmToken && fcmToken,
        },
        autoConnect: true,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        pingInterval: 10000,
        pingTimeout: 10000,
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to server");
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err.message);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [userId, fcmToken]);

  return (
    <SocketContext.Provider value={{ socket, updateFcmToken, setUserId }}>
      {children}
    </SocketContext.Provider>
  );
};

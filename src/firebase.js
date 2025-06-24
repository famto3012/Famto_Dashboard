import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Subscribe to incoming messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  // Handle notification display or other actions based on payload
  const { title, body } = payload.notification;
  // Example: Display notification using browser's native notification API
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
});

export { messaging, storage, auth, app };

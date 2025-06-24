importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAH0J7BtGKf3IkHsU8Pg5tFScfOwGzp3Z0",
  authDomain: "famto-aa73e.firebaseapp.com",
  projectId: "famto-aa73e",
  storageBucket: "famto-aa73e.appspot.com",
  messagingSenderId: "773492185977",
  appId: "1:773492185977:web:e425f759d3c13e8c2c2da8",
  measurementId: "G-TZ0J50H36P",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

const notificationSound = new Howl({
  src: [
    "https://res.cloudinary.com/dajlabmrb/video/upload/v1724931165/46ffbafd-37e2-403e-92ed-b56edd5df42e-Notification_sound_gyz5ux.mp3",
  ],
  preload: true,
  volume: 1.0,
  loop: false, // Adjust volume as needed
  onplayerror: function() {
    console.log("Error playing sound.");
  },
});

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) =>
      client.postMessage({
        type: "NOTIFICATION_RECEIVED",
        payload: payload,
      })
    );
  });

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    image: payload.notification.image,
    icon: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427320384.svg?alt=media&token=0be47a53-43f3-4887-9822-3baad0edd31e",
    data: {
      url: "https://dashboard.famto.in/home", // The URL to open when clicked
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions).then(() => {
    // Play notification sound after notification has been shown
    console.log("Notification sound played")
    notificationSound.play();
  });
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification click: ", event.notification.tag);
  event.notification.close();

  // Retrieve the URL from the notification data
  const targetUrl =
    event.notification.data.url || "https://dashboard.famto.in/home"; // Default to your homepage

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true, // Include tabs that may not be controlled by your service worker
      })
      .then((clientList) => {
        // Focus the tab if it is already open
        for (const client of clientList) { 
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }

        // If no tab is open with that URL, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

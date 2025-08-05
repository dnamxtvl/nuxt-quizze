// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCcvYDBndqwtGLlHp4zTRr_60-Uiu6IxcE",
  authDomain: "laravel-nuxt-6a617.firebaseapp.com",
  projectId: "laravel-nuxt-6a617",
  storageBucket: "laravel-nuxt-6a617.firebasestorage.app",
  messagingSenderId: "508440414241",
  appId: "1:508440414241:web:5aa2c4d8e48cb3a0e0bb60",
  measurementId: "G-X6Y5DSNHJV"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/mario_icon.png',
    data: {
      link: payload.data?.link || '/',
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const link = event.notification.data.link || '/';
  event.waitUntil(clients.openWindow(link));
});

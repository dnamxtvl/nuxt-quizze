// firebase.js (plugin hoặc middleware trong Nuxt 3)
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import api from '~/api/axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.FIREBASE_APP_ID,
    measurementId: config.FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker Registered');

        getToken(messaging, {
          vapidKey: config.FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken);
              api.auth.updateFcmToken({ token: currentToken })
                .then(() => {
                  console.log('FCM Token updated successfully');
                })
                .catch((error) => {
                  console.error('Error updating FCM Token:', error);
                });
            } else {
              console.warn('No registration token available.');
            }
          })
          .catch((err) => {
            console.error('An error occurred while retrieving token.', err);
          });
      });
  }
});

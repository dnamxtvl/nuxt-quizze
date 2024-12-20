import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
import { useMainStore } from '~/store';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const store = useMainStore();
  let echo;
  const RECONNECT_TIMEOUT = 4000;
  const RECONNECT_MAX_ATTEMPTS = 5;

  const initializeEcho = () => {
    echo = new Echo({
      broadcaster: "reverb",
      key: config.public.REVERB_KEY,
      authorizer: (channel) => {
        return {
          authorize: (socketId, callback) => {
            axios
              .post(
                "http://192.168.0.99/" + "broadcasting/auth",
                {
                  socket_id: socketId,
                  channel_name: channel.name,
                },
                { headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${store.$state.token}`,
                  'Access-Control-Allow-Credentials': true,
                }, withCredentials: true }
              )
              .then((response) => {
                callback(false, response.data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
      wsHost: '192.168.0.99',
      wsPort: 8080,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
      pongTimeout: 1000,
      activityTimeout: 1000,
      unavailableTimeout: 2000,
    });

    return echo;
  }
  
  initializeEcho();
  let retryAttempts = 0;
  let retryInterval;

  console.log(echo.connector.pusher.connection.options)

  echo.connector.pusher.connection.bind('connected', () => {
    console.log('WebSocket connected')

    if (retryInterval) {
      clearInterval(retryInterval);
      retryInterval = null;
    }

    retryAttempts = 0;
  })

  echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('WebSocket disconnected')
      retryInterval = setInterval(() => {
        if (retryAttempts < RECONNECT_MAX_ATTEMPTS) {
          console.log(`Thử kết nối lại lần ${retryAttempts + 1}...`);
          echo.connector.pusher.connect();
          retryAttempts++;
        } else {
          clearInterval(retryInterval);
          console.log('Không thể kết nối lại sau ' + RECONNECT_MAX_ATTEMPTS + ' lần thử.');
        }
      }, RECONNECT_TIMEOUT);
  })

  echo.connector.pusher.connection.bind('reconnecting', () => {
    console.log('WebSocket reconnecting')
  })

  echo.connector.pusher.connection.bind('reconnected', () => {
    console.log('WebSocket reconnected')
  })

  echo.connector.pusher.connection.bind('error', (error) => {
    console.error('WebSocket error:', error)
  })

  echo.connector.pusher.connection.bind('state_change', (states) => {
    console.log(`State changed from ${states.previous} to ${states.current}`)
    if (states.previous == 'connected' && states.current === 'connecting') {
      
    }
    if (states.current === 'unavailable') {
      clearInterval(retryInterval);
      echo.connector.pusher.disconnect();
    }
  })

  nuxtApp.provide('echo', echo);
});

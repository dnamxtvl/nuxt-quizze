import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
import { useMainStore } from '~/store';

export default defineNuxtPlugin((nuxtApp) => {
  const store = useMainStore();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${store.$state.token}`,
    'Access-Control-Allow-Credentials': true,
  };
  const echo = new Echo({
    broadcaster: "reverb",
    key: "2wmgxd4trrsufo21cglx",
    authorizer: (channel) => {
      return {
        authorize: (socketId, callback) => {
          axios
            .post(
              "http://laravel_new.local/broadcasting/auth",
              {
                socket_id: socketId,
                channel_name: channel.name,
              },
              { headers, withCredentials: true }
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
    wsHost: "laravel_new.local",
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    auth: {
      headers: {
        Authorization: `Bearer ${store.$state.token}`,
      },
    },
  });

  // Provide Echo instance to the rest of the application
  nuxtApp.provide('echo', echo);
});
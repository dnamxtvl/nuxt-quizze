import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
import { useMainStore } from '~/store';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const store = useMainStore();
  const echo = new Echo({
    broadcaster: "reverb",
    key: config.public.REVERB_KEY,
    authorizer: (channel) => {
      return {
        authorize: (socketId, callback) => {
          axios
            .post(
              config.public.BACKEND_URL + "broadcasting/auth",
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
              console.log(error);
              callback(true, error);
            });
        },
      };
    },
    wsHost: config.public.BACKEND_HOST,
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
  });

  // Provide Echo instance to the rest of the application
  nuxtApp.provide('echo', echo);
});

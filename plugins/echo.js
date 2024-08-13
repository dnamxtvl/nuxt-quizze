// plugins/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const echo = new Echo({
      broadcaster: "reverb",
      key: "2wmgxd4trrsufo21cglx",
      // authorizer: channel => {
      //     return {
      //         authorize: (socketId, callback) => {
      //             axios
      //               .post("/api/broadcasting/auth", {
      //                 socket_id: socketId,
      //                 channel_name: channel.name,
      //               })
      //               .then((response) => {
      //                 callback(false, response.data);
      //               })
      //               .catch((error) => {
      //                 callback(true, error);
      //               });
      //         },
      //     }
      // },
      wsHost: "laravel_new.local",
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
    });

  // Provide Echo instance to the rest of the application
  nuxtApp.provide('echo', echo);
});

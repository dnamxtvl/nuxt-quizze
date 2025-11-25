export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  devServer: {
    host: '0.0.0.0',
    port: 3002
  },
  app: {
    head: {
      title: 'QUIZZE HYOUBAN',
      meta: [{ name: 'description', content: 'QUIZZE HYOUBAN' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap' },
      ]
    },
  },
  runtimeConfig: {
    public: {
      BACKEND_URL: process.env.BACKEND_URL,
      REVERB_KEY: process.env.REVERB_KEY,
      BACKEND_HOST: process.env.BACKEND_HOST,
      FRONTEND_URL: process.env.FRONTEND_URL,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_VAPID_KEY: process.env.FIREBASE_VAPID_KEY,
    },
  },

  css: [
    'bootstrap/dist/css/bootstrap.css',
    'assets/styles/core.scss',
    'assets/styles/application.scss',
    'assets/fonts/fontawesome.css',
    'assets/fonts/tabler-icons.css',
    'assets/fonts/flag-icons.css',
  ],

  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    'nuxt-vue3-google-signin',
  ],
  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: ['dark'],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "/assets/styles/element/index.scss" as element;`,
        },
      },
    }
  },

  typescript: {
    strict: true,
    shim: false,
  },

  compatibilityDate: '2024-07-23',
})

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
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
      BACKEND_URL: process.env.BACKEND_URl
    }
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
  ],
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
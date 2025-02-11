// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [['@storyblok/nuxt', {
    accessToken: process.env.STORYBLOK_API_KEY,
    apiOptions: {
      region: 'eu'
    },
    componentResolver: {
      resolve: (component) => {
        return component
      }
    }
  }], '@nuxtjs/tailwindcss', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: 'andyevans.dev'
    }
  },
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/', '/posts/functional-testing-with-isolated-azure-functions']
    }
  },
})
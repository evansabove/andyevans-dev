// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    ['@storyblok/nuxt', {
      accessToken: process.env.STORYBLOK_API_KEY,
      apiOptions: {
        region: 'eu' // Change to 'eu' if your space is in EU
      },
      componentResolver: {
        resolve: (component) => {
          return component
        }
      }
    }]
  ]
})

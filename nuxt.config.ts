// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = 'andyevans.dev'

const fetchStoryblokRoutes = async () => {
  const apiToken = process.env.STORYBLOK_API_KEY
  const version = 'published'
  const storyblokApiUrl = `https://api.storyblok.com/v2/cdn/stories?token=${apiToken}&version=${version}`

  try {
    const response = await fetch(storyblokApiUrl)
    const stories = (await response.json()).stories || []

    return stories.map(story => `/${story.full_slug}`)
  } catch (error) {
    console.error('Error fetching Storyblok routes:', error)
    return []
  }
}

const storyblokRoutes = await fetchStoryblokRoutes()

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
  }], '@nuxtjs/tailwindcss', '@nuxt/fonts', '@nuxtjs/sitemap', '@nuxt/icon', 'dayjs-nuxt', 'nuxt-seo-utils'],
  fonts: {
    families: [ { name: 'Montserrat', provider: 'local' }]
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: appName,
      appUrl: 'https://andyevans.dev',
      appDescription: "I'm Andy Evans, a software engineer based in Sheffield, UK. I write about web development, software engineering, and other tech topics.",
      appImage: 'https://andyevans.dev/andyevans.jpeg',
    }
  },
  ssr: true,
  nitro: {
    prerender: {
      routes: storyblokRoutes
    }
  },
  app: {
    head: {
      title: appName,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          src: "https://www.googletagmanager.com/gtag/js?id=G-TW963KWK84"
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TW963KWK84');
          `,
          type: 'text/javascript',
        }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  site: {
    url: 'https://andyevans.dev',
    name: 'andyevans.dev',
    trailingSlash: true
  },
  experimental: {
    payloadExtraction: false
  }
})
// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = 'andyevans.dev'

const fetchStoryblokRoutes = async () => {
  const apiToken = process.env.STORYBLOK_API_KEY
  const version = 'published'
  const storyblokApiUrl = `https://api.storyblok.com/v2/cdn/stories?token=${apiToken}&version=${version}`

  try {
    const response = await fetch(storyblokApiUrl)
    const stories = (await response.json()).stories || []

    return stories.map((story: { full_slug: string }) => `/${story.full_slug}`)
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
      resolve: (component: string) => {
        return component
      }
    }
  }],
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxtjs/sitemap'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: appName
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
        { hid: appName, name: appName, content: appName }
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
          innerHTML: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5JWSMNHK');
          `,
        }
      ]
    }
  },
  site: {
    url: 'https://andyevans.dev',
    name: 'andyevans.dev'
  }
})
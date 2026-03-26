// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = 'andyevans.dev'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxt/fonts', '@nuxtjs/sitemap', '@nuxt/icon', 'dayjs-nuxt', 'nuxt-seo-utils'],
  fonts: {
    families: [{ name: 'Montserrat', provider: 'local', display: 'block' }]
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
      crawlLinks: true,
      routes: ['/']
    }
  },
  content: {},
  mdc: {
    highlight: {
      theme: 'github-light',
      langs: ['js', 'ts', 'vue', 'html', 'css', 'json', 'bash', 'csharp', 'c', 'cpp', 'yaml', 'markdown', 'sql', 'xml', 'kotlin']
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
    trailingSlash: false
  },
  experimental: {
    payloadExtraction: false
  }
})
// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = 'andyevans.dev'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxt/fonts', '@nuxtjs/sitemap', '@nuxt/icon', 'dayjs-nuxt', 'nuxt-seo-utils', 'nuxt-llms'],
  fonts: {
    families: [{ name: 'Montserrat', provider: 'local', display: 'swap' }]
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: appName,
      appUrl: 'https://andyevans.dev',
      appDescription: "I'm Andy Evans, a platform engineer based in Sheffield, UK. I write about Azure, Kubernetes, CI/CD, .NET and the tooling that makes development teams faster.",
      appImage: 'https://andyevans.dev/andyevans.jpeg',
    }
  },
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/cv/print/'],
      ignore: [],
      failOnError: false,
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
          src: "https://www.googletagmanager.com/gtag/js?id=G-TW963KWK84",
          async: true,
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TW963KWK84');
          `,
          type: 'text/javascript',
          defer: true,
        }
      ],
      htmlAttrs: {
        lang: 'en-GB'
      }
    }
  },
  // @nuxt/content feeds the posts in automatically; server/plugins/llms.ts adds the CV.
  llms: {
    domain: 'https://andyevans.dev',
    title: 'Andy Evans — Senior Software Engineer (.NET & Azure)',
    description: "Andy Evans is a senior software engineer and platform engineer based in Sheffield, UK, with over 12 years of experience building production software. He works primarily in C# and .NET, and leads on platform engineering, CI/CD and Azure cloud deployments.",
    full: {
      title: 'Andy Evans — Senior Software Engineer (.NET & Azure)',
      description: 'Full CV and the complete text of every post on andyevans.dev.',
    },
  },
  // /cv is the page to index; the print version only exists to be rendered to PDF.
  sitemap: {
    exclude: ['/cv/print/**'],
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
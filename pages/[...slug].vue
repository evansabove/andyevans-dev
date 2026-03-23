<script setup>
import { useStoryblokApi } from '@storyblok/vue'

const storyblokApi = useStoryblokApi()
const route = useRoute()

const slug = computed(() => route.path === '/' ? 'home' : route.path.replace(/^\/|\/$/g, '')) //remove leading and trailing slashes

const { data } = await useAsyncData(
  slug.value,
  async () => {
    const { data } = await storyblokApi.get(`cdn/stories/${slug.value}`, {
      version: process.env.NODE_ENV === 'production' ? 'published' : 'draft'
    })
    return data
  }
)

if (!data.value) {
  console.error("Data could not be fetched for slug:", slug.value);
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

const runtimeConfig = useRuntimeConfig()

const pageTitle = computed(() => data.value?.story?.content?.seo_title || data.value?.story?.name)

useHead({
  title: pageTitle,
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
})

useSeoMeta({
  ogTitle: computed(() => `${pageTitle.value} | Andy Evans`),
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${pageTitle.value} | Andy Evans`),
  twitterDescription: runtimeConfig.public.appDescription,
  twitterImage: runtimeConfig.public.appImage,
})

const story = computed(() => data.value?.story)

// Add WebSite + Person structured data on the home page only
if (route.path === '/') {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Andy Evans',
          url: runtimeConfig.public.appUrl,
        })
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Andy Evans',
          url: runtimeConfig.public.appUrl,
          image: runtimeConfig.public.appImage,
          jobTitle: 'Software Engineer',
          description: runtimeConfig.public.appDescription,
          sameAs: [
            'https://github.com/evansabove',
            'https://www.linkedin.com/in/andy-evans-557b1125'
          ]
        })
      }
    ]
  })
}
</script>

<template>
  <AppTemplate>
    <StoryblokComponent v-if="story" :blok="story?.content" class="story" />
  </AppTemplate>
</template>

<style scoped>
.story {
  @apply flex flex-col;
}
</style>
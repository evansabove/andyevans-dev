<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

// Build the content path from the URL slug (strip trailing slash only; v3 paths keep leading slash)
const contentPath = computed(() => route.path.replace(/\/$/, '') || '/')

const { data: post } = await useAsyncData(
  `post-${contentPath.value}`,
  () => queryCollection('posts').path(contentPath.value).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useHead({
  title: computed(() => post.value?.title),
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
})

useSeoMeta({
  ogTitle: computed(() => `${post.value?.title} | Andy Evans`),
  description: computed(() => post.value?.description ?? runtimeConfig.public.appDescription),
  ogDescription: computed(() => post.value?.description ?? runtimeConfig.public.appDescription),
  image: computed(() => post.value?.image ?? runtimeConfig.public.appImage),
  ogImage: computed(() => post.value?.image ?? runtimeConfig.public.appImage),
  ogType: 'article',
  ogLocale: 'en_GB',
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path.replace(/\/$/, '')}`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${post.value?.title} | Andy Evans`),
  twitterDescription: computed(() => post.value?.description ?? runtimeConfig.public.appDescription),
  twitterImage: computed(() => post.value?.image ?? runtimeConfig.public.appImage),
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.value?.title,
      description: post.value?.description,
      image: post.value?.image,
      datePublished: post.value?.date,
      author: [{ '@type': 'Person', name: 'Andy Evans', url: runtimeConfig.public.appUrl }],
      publisher: { '@type': 'Person', name: 'Andy Evans', url: runtimeConfig.public.appUrl },
    }))
  }]
})
</script>

<template>
  <AppTemplate>
    <BlogPost v-if="post" :post="post" />
  </AppTemplate>
</template>
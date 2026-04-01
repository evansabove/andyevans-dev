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
  ogImage: computed(() => post.value?.image ?? runtimeConfig.public.appImage),
  ogImageAlt: computed(() => post.value?.imageAlt),
  ogType: 'article',
  ogLocale: 'en_GB',
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${post.value?.title} | Andy Evans`),
  twitterDescription: computed(() => post.value?.description ?? runtimeConfig.public.appDescription),
  twitterImage: computed(() => post.value?.image ?? runtimeConfig.public.appImage),
  keywords: computed(() => post.value?.tags?.join(', ')),
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${runtimeConfig.public.appUrl}${route.path}`,
      },
      headline: post.value?.title,
      description: post.value?.description,
      keywords: post.value?.tags?.join(', '),
      image: post.value?.image ? [{
        '@type': 'ImageObject',
        url: `${runtimeConfig.public.appUrl}${post.value.image}`,
        description: post.value?.imageAlt,
      }] : undefined,
      url: `${runtimeConfig.public.appUrl}${route.path}`,
      datePublished: post.value?.date ? `${post.value.date}T00:00:00+00:00` : undefined,
      dateModified: ((post.value as any)?.dateModified ?? post.value?.date)
        ? `${((post.value as any)?.dateModified ?? post.value?.date)}T00:00:00+00:00`
        : undefined,
      author: [{ '@type': 'Person', name: 'Andy Evans', url: runtimeConfig.public.appUrl }],
      publisher: {
        '@type': 'Organization',
        name: 'Andy Evans',
        url: runtimeConfig.public.appUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${runtimeConfig.public.appUrl}/android-chrome-512x512.png`,
        },
      },
    }))
  }]
})
</script>

<template>
  <AppTemplate>
    <BlogPost v-if="post" :post="post" />
  </AppTemplate>
</template>
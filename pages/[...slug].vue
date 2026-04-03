<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

// Build the content path from the URL slug (strip trailing slash only; v3 paths keep leading slash)
const contentPath = computed(() => route.path.replace(/\/$/, '') || '/')

const { data: post } = await useAsyncData(
  `post-${contentPath.value}`,
  () => queryCollection('posts').path(contentPath.value).first()
)

if (!post.value || (!import.meta.dev && (post.value as any).draft === true)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const resolveAbsoluteImage = (imagePath?: string) => {
  const path = imagePath ?? runtimeConfig.public.appImage
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = runtimeConfig.public.appUrl.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

useHead({
  title: computed(() => post.value?.title),
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
  link: computed(() => {
    // Determine Canonical Source dynamically
    const canonicalSrc = (post.value as any)?.canonical 
        || `${runtimeConfig.public.appUrl.replace(/\/$/, '')}${route.path}`
        
    return [
      { rel: 'canonical', href: canonicalSrc }
    ]
  })
})

useSeoMeta({
  ogTitle: computed(() => `${post.value?.title} | Andy Evans`),
  description: computed(() => post.value?.description ?? runtimeConfig.public.appDescription),
  ogDescription: computed(() => post.value?.description ?? runtimeConfig.public.appDescription),
  ogImage: computed(() => resolveAbsoluteImage(post.value?.image)),
  ogImageAlt: computed(() => post.value?.imageAlt),
  ogType: 'article',
  ogLocale: 'en_GB',
  ogUrl: computed(() => `${runtimeConfig.public.appUrl.replace(/\/$/, '')}${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${post.value?.title} | Andy Evans`),
  twitterDescription: computed(() => post.value?.description ?? runtimeConfig.public.appDescription),
  twitterImage: computed(() => resolveAbsoluteImage(post.value?.image)),
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
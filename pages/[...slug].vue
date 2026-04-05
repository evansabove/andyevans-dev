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

const { data: readNextPosts } = await useAsyncData(
  `read-next-${contentPath.value}`,
  async () => {
    const query = queryCollection('posts').where('path', '<>', contentPath.value)
    if (!import.meta.dev) query.where('draft', '<>', true)
    
    const allOtherPosts = await query.all()
    const currentTags = (post.value as any)?.tags || []
    
    const scoredPosts = allOtherPosts.map(p => {
      const pTags = p.tags || []
      const score = pTags.filter((t: string) => currentTags.includes(t)).length
      return { post: p, score }
    })

    scoredPosts.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })

    return scoredPosts.slice(0, 3).map(sp => sp.post)
  }
)

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
    <div v-if="readNextPosts?.length" class="mt-16 pt-8 border-t border-purple-100">
      <RecentPosts :posts="readNextPosts" heading="Read next" />
    </div>
  </AppTemplate>
</template>
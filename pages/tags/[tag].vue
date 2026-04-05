<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const tagSlug = route.params.tag as string

const { data: allPosts } = await useAsyncData(`posts-for-tag-${tagSlug}`, () => {
  const query = queryCollection('posts').order('date', 'DESC')
  if (!import.meta.dev) query.where('draft', '<>', true)
  return query.all()
})

const posts = computed(() => {
  if (!allPosts.value) return []
  return allPosts.value.filter(post => 
    post.tags?.some((t: string) => t.toLowerCase().replace(/\s+/g, '-') === tagSlug)
  )
})

const tagName = computed(() => {
  if (posts.value.length > 0) {
    const originalTag = posts.value[0].tags?.find((t: string) => t.toLowerCase().replace(/\s+/g, '-') === tagSlug)
    if (originalTag) return originalTag
  }
  // Try to capitalize nicely as a fallback
  return tagSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
})

useHead({
  title: computed(() => `Posts tagged with ${tagName.value}`),
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Posts tagged with ${tagName.value} | Andy Evans`,
        description: `Read all the posts from Andy Evans about ${tagName.value}.`,
        url: `${runtimeConfig.public.appUrl}${route.path}`,
        publisher: {
          '@type': 'Organization',
          name: 'Andy Evans',
          url: runtimeConfig.public.appUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${runtimeConfig.public.appUrl}/android-chrome-512x512.png`
          }
        },
        hasPart: posts.value?.map(post => ({
          '@type': 'Article',
          url: `${runtimeConfig.public.appUrl}${post.path}`,
          headline: post.title,
          description: post.description,
        }))
      }))
    }
  ]
})

useSeoMeta({
  ogTitle: computed(() => `Posts tagged with ${tagName.value} | Andy Evans`),
  description: computed(() => `Read all the posts from Andy Evans about ${tagName.value}.`),
  ogDescription: computed(() => `Read all the posts from Andy Evans about ${tagName.value}.`),
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `Posts tagged with ${tagName.value} | Andy Evans`),
  twitterDescription: computed(() => `Read all the posts from Andy Evans about ${tagName.value}.`),
  twitterImage: runtimeConfig.public.appImage,
})
</script>

<template>
  <AppTemplate>
    <div class="mb-12">
      <h1 class="text-4xl font-bold mb-4">Topic: <span class="text-purple-700">{{ tagName }}</span></h1>
      <p class="text-gray-600">Showing all posts categorized under "{{ tagName }}".</p>
    </div>
    
    <BlogPostList :posts="posts ?? []" />
    
    <div v-if="posts && posts.length === 0" class="text-gray-500 italic mt-8">
      No posts found for this topic.
    </div>
  </AppTemplate>
</template>

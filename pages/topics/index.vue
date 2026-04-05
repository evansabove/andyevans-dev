<script setup lang="ts">
import { computed } from 'vue'

const runtimeConfig = useRuntimeConfig()
const route = useRoute()

// Fetch all posts to extract tags
const { data: posts } = await useAsyncData('all-posts-for-tags-index', () => {
  const query = queryCollection('posts').order('date', 'DESC')
  if (!import.meta.dev) query.where('draft', '<>', true)
  return query.all()
})

// Calculate unique tags and their subset of posts
const uniqueTags = computed(() => {
  if (!posts.value) return []
  
  const tagCounts: Record<string, { name: string, slug: string, allPostsCount: number, postsPreview: any[] }> = {}
  
  posts.value.forEach(post => {
    if (!post.tags) return
    post.tags.forEach((tag: string) => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-')
      if (!tagCounts[slug]) {
        // Assume the first casing we see is the preferred one
        tagCounts[slug] = { name: tag, slug, allPostsCount: 0, postsPreview: [] }
      }
      tagCounts[slug].allPostsCount++
      
      // Store max 3 posts for preview
      if (tagCounts[slug].postsPreview.length < 3) {
        tagCounts[slug].postsPreview.push(post)
      }
    })
  })
  
  // Sort alphabetically by name
  return Object.values(tagCounts).sort((a, b) => a.name.localeCompare(b.name))
})

useHead({
  title: 'Explore Topics',
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
})

useSeoMeta({
  ogTitle: 'Explore Topics | Andy Evans',
  description: 'Browse articles by topic on Andy Evans\' software engineering blog.',
  ogDescription: 'Browse articles by topic on Andy Evans\' software engineering blog.',
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: 'Explore Topics | Andy Evans',
  twitterDescription: 'Browse articles by topic on Andy Evans\' software engineering blog.',
  twitterImage: runtimeConfig.public.appImage,
})
</script>

<template>
  <AppTemplate>
    <div class="mb-2">
      <h1 class="text-4xl font-bold mb-4">Explore Topics</h1>
      <p class="text-gray-600 text-lg">Browse posts by topic.</p>
    </div>
    
    <div class="flex flex-col">
      <div v-for="tag in uniqueTags" :key="tag.slug">
        <RecentPosts 
          :posts="tag.postsPreview" 
          :heading="tag.name"
          :hideFooter="tag.allPostsCount <= tag.postsPreview.length"
          :viewAllUrl="`/topics/${tag.slug}`"
          :viewAllText="'View all ' + tag.allPostsCount + ' ' + tag.name + ' posts →'"
        />
      </div>
    </div>
  </AppTemplate>
</template>

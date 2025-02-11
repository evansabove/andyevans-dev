<template>
  <div v-for="story in stories" :key="story.uuid">
    <NuxtLink :to="story.full_slug" class="blog-header">{{ story.name }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps({ blok: Object })
import { useStoryblokApi } from '@storyblok/vue'

const storyblokApi = useStoryblokApi()

const { data } = await useAsyncData(
  'blog-post-list',
  async () => {
    const { data } = await storyblokApi.get(`cdn/stories`, {
      version: process.env.NODE_ENV === 'production' ? 'published' : 'draft'
    })
    return data
  }
)

const stories = computed(() => data.value?.stories)

</script>

<style scoped>
.blog-header {
  @apply text-2xl;
  @apply no-underline;
  @apply mb-3;
}
</style>
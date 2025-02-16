<template>
  <div class="blog-post-list">
    <div v-for="story in stories" :key="story.uuid">
      <NuxtLink :to="`/${story.full_slug}`" class="list-item-container">
        <img :src="story.content.body[0].Image?.filename" :alt="story.content.body[0].Image?.alt" class="list-item-image" />

        <div class="list-item-content">
          <div class="list-item-header">{{ story.content.body[0].Title }}</div>
          <div>{{ story.content.body[0].Description }}</div>
        </div>

      </NuxtLink>
    </div>
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
      version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
      starts_with: 'posts/',
      is_startpage: false
    })
    return data
  }
)

const stories = computed(() => data.value?.stories)

</script>

<style scoped>
.blog-post-list {
  @apply flex flex-col;
}

.list-item-image {
  @apply w-1/4;
  @apply object-cover;
  @apply rounded-lg;
}

.list-item-header {
  @apply text-2xl;
  @apply mb-3;
}

.list-item-container {
  @apply flex;
  @apply mb-5;
  @apply no-underline;
}

.list-item-content {
  @apply flex flex-col;
  @apply ml-5;
  @apply no-underline;
}
</style>
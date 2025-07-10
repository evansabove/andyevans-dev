<template>
  <div class="blog-post-list">
    <div v-for="story in stories" :key="story.uuid">
      <NuxtLink :to="`/${story.full_slug}`" class="list-item-container">
        <img :src="story.content.body[0].Image?.filename" :alt="story.content.body[0].Image?.alt" class="list-item-image" />

        <div class="list-item-content">
          <div class="list-item-header">{{ story.content.body[0].Title }}</div>
          <div class="list-item-date">{{ $dayjs(story.content.body[0].WrittenDate).format("MMM YYYY") }}</div>
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
      version: process.env.NODE_ENV === 'production' || 'prerender' ? 'published' : 'draft',
      starts_with: 'posts/',
      is_startpage: false,

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
  @apply object-cover;
  @apply rounded-lg;
  @apply h-64 w-full md:w-64 md:h-64;
}

.list-item-header {
  @apply text-2xl;
  @apply mb-1;
}

.list-item-date {
  @apply font-bold;
  @apply mb-3;
}

.list-item-container {
  @apply flex flex-col md:flex-row;
  @apply mb-20  ;
  @apply no-underline;
}

.list-item-content {
  @apply flex flex-col;
  @apply md:ml-5;
  @apply mt-5 md:mt-0;
  @apply no-underline;
}
</style>
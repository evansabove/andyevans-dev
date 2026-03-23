<template>
  <div class="blog-post-list">
    <div v-for="story in stories" :key="story.uuid">
      <NuxtLink :to="`/${story.full_slug}/`" class="list-item-container">
        <div class="list-item-image-wrap">
          <img :src="story.content.body[0].Image?.filename" :alt="story.content.body[0].Image?.alt || story.content.body[0].Title"
            class="list-item-image" />
        </div>

        <div class="list-item-content">
          <div class="list-item-date">{{ $dayjs(story.content.body[0].WrittenDate).format("MMM YYYY") }}</div>
          <h2 class="list-item-header">{{ story.content.body[0].Title }}</h2>
          <div class="list-item-description">{{ story.content.body[0].Description }}</div>
          <div class="list-item-cta">Read post →</div>
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

.list-item-image-wrap {
  @apply rounded-lg overflow-hidden shrink-0;
  @apply w-full md:w-64;
  aspect-ratio: 16 / 9;

  @media (min-width: 768px) {
    aspect-ratio: 1 / 1;
    width: 16rem;
    height: 16rem;
  }
}

.list-item-image {
  @apply w-full h-full object-cover;
  @apply transition-transform duration-300;
}

.list-item-header {
  @apply text-2xl;
  @apply mb-2;
}

.list-item-date {
  @apply text-sm text-purple-700 font-semibold;
  @apply mb-1;
}

.list-item-description {
  @apply text-gray-600;
  @apply mb-4;
}

.list-item-cta {
  @apply text-purple-900 font-semibold text-sm;
  @apply mt-auto self-end;
}

.list-item-container {
  @apply flex flex-col md:flex-row;
  @apply mb-12;
  @apply no-underline;
  @apply border-l-4 border-transparent;
  @apply pl-0 transition-all duration-200;

  &:hover {
    @apply border-purple-700 pl-3;

    .list-item-image {
      @apply scale-105;
    }
  }
}

.list-item-content {
  @apply flex flex-col;
  @apply md:ml-6;
  @apply mt-5 md:mt-0;
}
</style>
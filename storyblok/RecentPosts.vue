<template>
  <section v-editable="blok" class="recent-posts">
    <h2 class="recent-posts__heading">{{ blok.Heading || 'Recent Posts' }}</h2>
    <div class="recent-posts__grid">
      <NuxtLink
        v-for="story in stories"
        :key="story.uuid"
        :to="`/${story.full_slug}/`"
        class="tile"
      >
        <div class="tile__image-wrap">
          <img
            class="tile__image"
            :src="story.content.body[0].Image?.filename"
            :alt="story.content.body[0].Image?.alt || story.content.body[0].Title"
          />
        </div>
        <div class="tile__body">
          <div class="tile__date">{{ $dayjs(story.content.body[0].WrittenDate).format('MMM YYYY') }}</div>
          <h3 class="tile__title">{{ story.content.body[0].Title }}</h3>
          <p class="tile__description">{{ story.content.body[0].Description }}</p>
          <div class="tile__tags">
            <TagList :bloks="story.content.body[0].Tags" />
          </div>
          <span class="tile__cta">Read post →</span>
        </div>
      </NuxtLink>
    </div>
    <div class="recent-posts__footer">
      <NuxtLink to="/posts/" class="recent-posts__view-all">View all posts →</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useStoryblokApi } from '@storyblok/vue'

defineProps({ blok: Object })

const storyblokApi = useStoryblokApi()

const { data } = await useAsyncData(
  'recent-posts',
  async () => {
    const { data } = await storyblokApi.get('cdn/stories', {
      version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
      starts_with: 'posts/',
      is_startpage: false,
      per_page: 3,
      sort_by: 'content.WrittenDate:desc',
    })
    return data
  }
)

const stories = computed(() => data.value?.stories ?? [])
</script>

<style scoped>
.recent-posts {
  @apply w-full;
  @apply py-10;
  @apply flex flex-col;

  &__heading {
    @apply text-2xl font-bold;
    @apply mb-8;
  }

  &__grid {
    @apply grid gap-6;
    @apply grid-cols-1 md:grid-cols-3;
  }

  &__footer {
    @apply mt-8 text-right;
  }

  &__view-all {
    @apply text-purple-900 font-semibold;
    @apply no-underline hover:underline;
  }
}

.tile {
  @apply flex flex-col;
  @apply rounded-xl overflow-hidden;
  @apply border border-purple-100;
  @apply no-underline;
  @apply bg-white;
  @apply shadow-sm;
  @apply transition-all duration-200;

  &:hover {
    @apply shadow-md -translate-y-1;
    @apply border-purple-300;
  }

  &__image-wrap {
    @apply overflow-hidden;
    height: 12rem;
  }

  &__image {
    @apply w-full h-full object-cover;
    @apply transition-transform duration-300;
  }

  &:hover &__image {
    @apply scale-105;
  }

  &__body {
    @apply flex flex-col flex-1;
    @apply p-5;
  }

  &__date {
    @apply text-sm text-purple-700 font-semibold;
    @apply mb-2;
  }

  &__title {
    @apply text-lg font-bold;
    @apply mb-2;
    @apply leading-snug;
  }

  &__description {
    @apply text-sm text-gray-600;
    @apply mb-4 flex-1;
    @apply line-clamp-3;
  }

  &__tags {
    @apply mb-4;
  }

  &__cta {
    @apply text-purple-900 font-semibold text-sm;
    @apply mt-auto;
  }
}
</style>

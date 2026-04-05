<template>
  <section class="recent-posts">
    <h2 class="recent-posts__heading">{{ heading }}</h2>
    <div class="recent-posts__grid">
      <div
        v-for="post in posts"
        :key="post.path"
        class="tile group relative"
      >
        <div class="tile__image-wrap">
          <img
            class="tile__image"
            :src="thumbSrc(post.image)"
            :alt="post.imageAlt || post.title"
          />
        </div>
        <div class="tile__body">
          <div class="tile__date">
            <span v-if="post.draft" class="tile__draft-badge">Draft</span>
            <span>{{ $dayjs(post.date).format('MMM YYYY') }}</span>
          </div>
          <h3 class="tile__title">
            <NuxtLink :to="post.path" class="tile__main-link">{{ post.title }}</NuxtLink>
          </h3>
          <p class="tile__description">{{ post.description }}</p>
          <div class="tile__tags relative z-10">
            <TagList :tags="post.tags ?? []" />
          </div>
          <span class="tile__cta">Read post →</span>
        </div>
      </div>
    </div>
    <div v-if="!hideFooter" class="recent-posts__footer">
      <NuxtLink :to="viewAllUrl || '/posts'" class="recent-posts__view-all">{{ viewAllText || 'View all posts →' }}</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  posts: Record<string, any>[]
  heading?: string
  hideFooter?: boolean
  viewAllUrl?: string
  viewAllText?: string
}>()

function thumbSrc(src: string): string {
  if (!src) return src
  return src.replace(/(\.[^.]+)$/, '-thumb.webp')
}
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
    @apply flex items-center gap-2;
    @apply text-sm text-purple-700 font-semibold;
    @apply mb-2;
  }

  &__draft-badge {
    @apply text-[10px] font-bold uppercase tracking-wider;
    @apply bg-amber-100 text-amber-700 border border-amber-300;
    @apply rounded px-1.5 py-0.5;
  }

  &__title {
    @apply text-lg font-bold;
    @apply mb-2;
    @apply leading-snug;
  }

  &__main-link {
    @apply no-underline text-inherit;
    
    &::after {
      content: '';
      @apply absolute inset-0 z-0;
    }
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

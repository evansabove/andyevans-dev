<template>
  <div class="blog-post-list">
    <div v-for="post in posts" :key="post.path">
      <NuxtLink :to="post.path" class="list-item-container">
        <div class="list-item-image-wrap">
          <img :src="thumbSrc(post.image)" :alt="post.imageAlt || post.title" class="list-item-image" />
        </div>

        <div class="list-item-content">
          <div class="list-item-date">{{ $dayjs(post.date).format("MMM YYYY") }}</div>
          <h2 class="list-item-header">{{ post.title }}</h2>
          <div class="list-item-description">{{ post.description }}</div>
          <div class="list-item-cta">Read post →</div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ posts: Record<string, any>[] }>()

function thumbSrc(src: string): string {
  if (!src) return src
  return src.replace(/(\.[^.]+)$/, '-thumb.webp')
}
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

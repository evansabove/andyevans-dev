<template>
  <div class="blog-post">
    <h1 class="blog-title">{{ post.title }}</h1>
    <div class="blog-description">{{ post.description }}</div>
    <div class="blog-tags">
      <TagList :tags="post.tags ?? []" />
    </div>
    <div v-if="post.image" class="blog-image">
      <img :src="post.image" :alt="post.imageAlt || post.title" />
    </div>
    <div class="blog-date">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clip-rule="evenodd" />
      </svg>
      {{ $dayjs(post.date).format("MMMM YYYY") }}
    </div>
    <div class="blog-content prose">
      <ContentRenderer :value="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ post: Record<string, any> }>()
</script>

<style scoped>
.blog {
  &-post {
    @apply flex flex-col;
  }

  &-title {
    @apply text-4xl font-bold;
    @apply mb-5;
  }

  &-description {
    margin-bottom: 2rem;
  }

  &-image {
    max-height: 20rem;
    overflow: hidden;
    @apply mb-6;
    @apply flex items-center justify-center;

    img {
      @apply w-full h-full object-cover;
    }
  }

  &-date {
    @apply inline-flex items-center gap-1.5 self-start;
    @apply text-sm font-medium text-purple-700;
    @apply bg-purple-100 border border-purple-200;
    @apply rounded-full px-3 py-1;

    svg {
      @apply w-4 h-4 flex-shrink-0;
    }
  }

  &-tags {
    @apply mb-5;
  }
}
</style>


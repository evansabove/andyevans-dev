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
    <div class="blog-date">Written: {{ $dayjs(post.date).format("MMMM YYYY") }}</div>
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
    @apply mb-10;
    @apply flex items-center justify-center;

    img {
      @apply w-full h-full object-cover;
    }
  }

  &-date {
    @apply font-bold;
    @apply mb-5;
  }

  &-tags {
    @apply mb-5;
  }

  &-content {
    @apply mt-5;
  }
}
</style>

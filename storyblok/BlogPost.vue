<template>
  <div v-editable="blok" class="blog-post">
    <div class="blog-title">{{ blok.Title }}</div>
    <div class="blog-description">{{ blok.Description }}</div>
    <div class="blog-tags">
      <TagList :bloks="blok.Tags" />
    </div>
    <div class="blog-image">
      <img :src="blok.Image?.filename" alt="Blog Image" />
    </div>

    <div class="blog-date">Written: {{ $dayjs(blok.WrittenDate).format("MMMM YYYY") }}</div>
    <div class="blog-content">
      {{ blok.Content }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object })

useSeoMeta({
  description: props.blok.Description,
  image: props.blok.Image?.filename,
  ogDescription: props.blok.Description,
  ogImage: props.blok.Image?.filename,
  ogType: 'article',
  ogLocale: 'en_GB'
})

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
    @apply italic;
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
}
</style>
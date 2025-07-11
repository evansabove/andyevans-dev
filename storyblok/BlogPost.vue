<template>
  <div v-editable="blok" class="blog-post">
    <div class="blog-title">{{ blok.Title }}</div>
    <div class="blog-description">{{ blok.Description }}</div>
    <div class="blog-image">
      <img :src="blok.Image.filename" alt="Blog Image" />
    </div>

    <div class="blog-date">Written: {{ $dayjs(blok.WrittenDate).format("MMMM YYYY") }}</div>
    <div class="blog-content">
      {{ blok.Content }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object })
const runtimeConfig = useRuntimeConfig()

const route = useRoute()
const slug = computed(() => route.path.replace(/^\//, ''))

useSeoMeta({
  title: props.blok.Title,
  description: props.blok.Description,
  image: props.blok.Image?.filename,
  ogTitle: props.blok.Title,
  ogDescription: props.blok.Description,
  ogImage: props.blok.Image?.filename,
  ogUrl: `${runtimeConfig.public.appUrl}/${slug.value}`,
  ogType: 'article',
  ogSiteName: runtimeConfig.public.appName,
  ogLocale: 'en_GB'
})

</script>

<style scoped>
.blog-post {
  @apply flex flex-col;
}

.blog-title {
  @apply text-4xl font-bold;
  @apply mb-5;
}

.blog-description {
  margin-bottom: 2rem;
  @apply italic;
}

.blog-image {
  max-height: 20rem;
  overflow: hidden;
  @apply mb-10;
  @apply flex items-center justify-center;
}

.blog-image img {
  @apply w-full h-full object-cover;
}

.blog-date {
  @apply font-bold;
  @apply mb-5;
}
</style>
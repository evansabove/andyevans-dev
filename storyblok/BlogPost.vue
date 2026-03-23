<template>
  <div v-editable="blok" class="blog-post">
    <h1 class="blog-title">{{ blok.Title }}</h1>
    <div class="blog-description">{{ blok.Description }}</div>
    <div class="blog-tags">
      <TagList :bloks="blok.Tags" />
    </div>
    <div class="blog-image">
      <img :src="blok.Image?.filename" :alt="blok.Image?.alt || blok.Title" />
    </div>

    <div class="blog-date">Written: {{ $dayjs(blok.WrittenDate).format("MMMM YYYY") }}</div>
    <div class="blog-content" v-html="renderedContent" />
  </div>
</template>

<script setup>
import { richTextResolver } from '@storyblok/richtext'

const props = defineProps({ blok: Object })

const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const { render } = richTextResolver()
const renderedContent = computed(() => {
  if (!props.blok.Content) return ''
  if (typeof props.blok.Content !== 'object') return props.blok.Content
  try {
    return render(props.blok.Content)
  } catch {
    return props.blok.Content?.content?.map(n => n?.content?.map(c => c?.text ?? '').join('') ?? '').join('\n') ?? ''
  }
})

useHead({
  title: computed(() => props.blok.Title),
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
})

useSeoMeta({
  ogTitle: computed(() => `${props.blok.Title} | Andy Evans`),
  description: props.blok.Description,
  image: props.blok.Image?.filename,
  ogDescription: props.blok.Description,
  ogImage: props.blok.Image?.filename,
  ogType: 'article',
  ogLocale: 'en_GB',
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${props.blok.Title} | Andy Evans`),
  twitterDescription: computed(() => props.blok.Description),
  twitterImage: computed(() => props.blok.Image?.filename),
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: props.blok.Title,
      description: props.blok.Description,
      image: props.blok.Image?.filename,
      datePublished: props.blok.WrittenDate,
      author: [{ '@type': 'Person', name: 'Andy Evans', url: runtimeConfig.public.appUrl }],
      publisher: { '@type': 'Person', name: 'Andy Evans', url: runtimeConfig.public.appUrl },
    }))
  }]
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
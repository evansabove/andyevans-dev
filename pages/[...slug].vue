<script setup>
import { useStoryblokApi } from '@storyblok/vue'

const storyblokApi = useStoryblokApi()
const route = useRoute()

const slug = computed(() => route.path === '/' ? 'home' : route.path.replace(/^\//, ''))

const { data } = await useAsyncData(
  slug.value,
  async () => {
    const { data } = await storyblokApi.get(`cdn/stories/${slug.value}`, {
      version: process.env.NODE_ENV === 'production' ? 'published' : 'draft'
    })
    return data
  }
)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

const config = useRuntimeConfig()
useHead({
  title: computed(() => data.value?.story?.name),
})

const runtimeConfig = useRuntimeConfig()

useSeoMeta({
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage
})

const story = computed(() => data.value?.story)
</script>

<template>
  <AppTemplate>
    <StoryblokComponent v-if="story" :blok="story.content" class="story" />
  </AppTemplate>
</template>

<style scoped>
.story {
  @apply flex flex-col;
}
</style>
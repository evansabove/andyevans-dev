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

const story = computed(() => data.value?.story)
</script>

<template>
  <div class="app-wrapper bg-stone-100">
    <Header />

    <main class="main-content">
      <StoryblokComponent v-if="story" :blok="story.content" class="story" />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.story {
  @apply flex flex-col;
}
</style>
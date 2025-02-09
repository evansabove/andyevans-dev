<template>
  <div>
    <StoryblokComponent v-if="story" :blok="story.content" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStoryblokApi } from '@storyblok/vue'

const storyblokApi = useStoryblokApi()
const story = ref(null)

// Fetch the story content from Storyblok
async function fetchStory() {
  const { data } = await storyblokApi.get('cdn/stories/home', {
    version: process.env.NODE_ENV === 'production' ? 'published' : 'draft'
  })
  story.value = data.story
}

// Fetch content when component is mounted
onMounted(() => {
  fetchStory()
})
</script>
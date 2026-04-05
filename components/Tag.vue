<template>
  <NuxtLink :to="`/tags/${formattedTag}`" class="tag">{{ tag }}</NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ 
  tag: string
}>()

const formattedTag = computed(() => {
  return props.tag.toLowerCase().replace(/\s+/g, '-')
})
</script>

<style scoped>
.tag {
  @apply inline-block;
  @apply bg-purple-100 text-purple-800;
  @apply text-sm font-semibold;
  @apply px-3 py-1 rounded-full;
  @apply mr-2 mb-2;
  @apply transition-colors duration-200;
  @apply no-underline;
}

.tag:hover {
  @apply bg-purple-200 text-purple-900;
}
</style>

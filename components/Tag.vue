<template>
  <span class="tag">{{ tag }}</span>
</template>

<script setup lang="ts">
defineProps<{ tag: string }>()
</script>

<style scoped>
.tag {
  @apply inline-block;
  @apply bg-purple-100 text-purple-800;
  @apply text-sm font-semibold;
  @apply px-3 py-1 rounded-full;
  @apply mr-2 mb-2;
}
</style>

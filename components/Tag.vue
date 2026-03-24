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
  @apply text-xs font-semibold;
  @apply px-2 py-1 rounded-full;
  @apply mr-1 mb-1;
}
</style>

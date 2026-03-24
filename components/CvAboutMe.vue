<template>
  <div class="about-me">
    <h3 class="about-me__title">✅{{ title }}</h3>
    <p class="about-me__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  text: string
}>()
</script>

<style scoped>
.about-me {
  @apply mb-4 pb-4 border-b border-stone-100 last:border-0 last:mb-0 last:pb-0;
}

.about-me__title {
  @apply font-semibold text-purple-900 mb-1;
}

.about-me__text {
  @apply text-gray-700 text-sm leading-relaxed;
}
</style>

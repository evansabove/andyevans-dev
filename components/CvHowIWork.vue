<template>
  <div class="how-i-work">
    <h3 class="how-i-work__title">
      <span class="how-i-work__marker" aria-hidden="true">✅</span>
      {{ title }}
    </h3>
    <p class="how-i-work__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  text: string
}>()
</script>

<style scoped>
.how-i-work {
  @apply mb-4 pb-4 border-b border-stone-200 last:border-0 last:mb-0 last:pb-0;
}

.how-i-work__title {
  @apply flex items-baseline gap-2;
  @apply font-semibold text-purple-900;
  /* override the global h3 sizing and margins */
  font-size: 1rem !important;
  margin-top: 0 !important;
  margin-bottom: 0.25rem !important;
}

.how-i-work__marker {
  @apply flex-shrink-0;
}

.how-i-work__text {
  @apply text-gray-700 leading-relaxed;
  margin-bottom: 0;
}
</style>

<template>
  <div class="career-break">
    <div class="career-break__header">
      <div>
        <h3 class="career-break__title">{{ title }}</h3>
        <p v-if="location" class="career-break__location">{{ location }}</p>
      </div>
      <p class="career-break__dates">
        <time :datetime="start">{{ formatDate(start) }}</time>
        –
        <time v-if="end" :datetime="end">{{ formatDate(end) }}</time>
        <span v-else>Present</span>
      </p>
    </div>
    <p v-if="summary" class="career-break__summary">{{ summary }}</p>
  </div>
</template>

<script setup lang="ts">
// Deliberately lighter than a role card: it explains the gap in the timeline without
// presenting itself as employment.
defineProps<{
  title: string
  start: string
  end?: string | null
  location?: string
  summary?: string
}>()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
.career-break {
  @apply border border-dashed border-stone-300 rounded-lg px-5 py-4 mb-4 bg-stone-50;
}

.career-break__header {
  @apply flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1;
}

.career-break__title {
  @apply font-semibold text-gray-600;
  /* override the global h3 sizing and margins */
  font-size: 1rem !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.career-break__location {
  @apply text-gray-500 text-sm;
  margin-bottom: 0;
}

.career-break__dates {
  @apply text-sm text-gray-500 font-medium sm:text-right flex-shrink-0;
  margin-bottom: 0;
}

.career-break__summary {
  @apply text-gray-600 text-sm mt-2;
  margin-bottom: 0;
}
</style>

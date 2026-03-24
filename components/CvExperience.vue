<template>
  <div class="experience">
    <div class="experience__header">
      <div>
        <p class="experience__title">{{ title }}</p>
        <p class="experience__business">{{ business }}</p>
      </div>
      <div class="experience__meta">
        <p class="experience__dates">{{ formatDate(start) }} – {{ end ? formatDate(end) : 'Present' }}</p>
        <p class="experience__location">{{ location }}</p>
      </div>
    </div>
    <p v-if="summary" class="experience__summary">{{ summary }}</p>
    <div v-if="tags?.length" class="experience__tags">
      <TagList :tags="tags" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  business: string
  start: string
  end?: string | null
  location?: string
  summary?: string
  tags?: string[]
}>()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
.experience {
  @apply border border-stone-200 rounded-lg p-5 mb-4 bg-white;
}

.experience__header {
  @apply flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2;
}

.experience__title {
  @apply font-semibold text-purple-900;
}

.experience__business {
  @apply text-gray-600;
}

.experience__meta {
  @apply text-sm text-gray-500 sm:text-right;
}

.experience__dates {
  @apply font-medium;
}

.experience__summary {
  @apply text-gray-700 text-sm mt-2;
}

.experience__tags {
  @apply mt-3;
}
</style>

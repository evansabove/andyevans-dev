<template>
  <div class="education">
    <div class="education__header">
      <div>
        <h3 class="education__course">{{ course }}</h3>
        <p class="education__location">{{ study_location }}</p>
      </div>
      <div class="education__meta">
        <p class="education__years">{{ year_start }} – {{ year_end }}</p>
        <p v-if="grade" class="education__grade">{{ grade }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  course: string
  study_location: string
  year_start: number
  year_end: number
  grade?: string
}>()
</script>

<style scoped>
.education {
  @apply border border-stone-200 rounded-lg p-5 mb-4 bg-white;
}

.education__header {
  @apply flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1;
}

.education__course {
  @apply font-semibold text-purple-900;
  /* override the global h3 sizing and margins */
  font-size: 1.0625rem !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.education__location {
  @apply text-gray-600;
  margin-bottom: 0;
}

.education__meta {
  @apply text-sm text-gray-500 sm:text-right flex-shrink-0;
}

.education__years {
  @apply font-medium;
  margin-bottom: 0;
}

.education__grade {
  @apply italic;
  margin-bottom: 0;
}
</style>

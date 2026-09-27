<template>
  <div class="skills">
    <div v-for="group in groups" :key="group.category" class="skills__group">
      <h3 class="skills__category">{{ group.category }}</h3>
      <CvChips :items="group.items" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  groups: { category: string, items: string[] }[]
}>()
</script>

<style scoped>
.skills {
  @apply border border-stone-200 rounded-lg p-5 bg-white;
}

.skills__group {
  @apply mb-4 last:mb-0;
}

.skills__category {
  @apply text-sm font-semibold text-purple-800 uppercase tracking-wide;
  /* override the global h3 sizing and margins */
  font-size: 0.8125rem !important;
  margin-top: 0 !important;
  margin-bottom: 0.5rem !important;
}
</style>

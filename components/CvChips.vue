<template>
  <ul class="chips">
    <li v-for="item in items" :key="item" class="chips__item">{{ item }}</li>
  </ul>
</template>

<script setup lang="ts">
// Deliberately not links. Routing these to /topics/<tag> prerenders a topic page for every
// skill on the CV, most of which have no posts behind them.
defineProps<{
  items: string[]
}>()
</script>

<style scoped>
.chips {
  @apply flex flex-wrap list-none;
  margin: 0;
  padding: 0;
}

.chips__item {
  @apply inline-block;
  @apply bg-purple-100 text-purple-800;
  @apply text-sm font-semibold;
  @apply px-3 py-1 rounded-full;
  @apply mr-2 mb-2;
  margin-top: 0;
  padding-left: 0.75rem;
}
</style>

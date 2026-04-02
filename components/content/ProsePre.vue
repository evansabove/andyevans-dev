<template>
  <div class="code-block">
    <div v-if="filename" class="code-block__title">{{ filename }}</div>
    <pre v-bind="$attrs" class="code-block__pre"><slot /></pre>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
}>()
</script>

<style scoped>
.code-block {
  @apply my-6 rounded-lg overflow-hidden;
  @apply border border-purple-200;
  @apply bg-purple-50;
}

.code-block__title {
  @apply bg-purple-100 text-purple-800;
  @apply text-xs font-semibold px-4 py-2;
  @apply border-b border-purple-200;
}

.code-block__pre {
  @apply p-5 whitespace-pre-wrap;
  @apply text-sm leading-relaxed;
  @apply m-0 rounded-none;
  font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
}
</style>


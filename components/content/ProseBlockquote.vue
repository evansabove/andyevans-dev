<template>
  <blockquote class="blockquote">
    <slot />
  </blockquote>
</template>

<style scoped>
.blockquote {
  @apply my-6 px-5 py-4;
  @apply border-l-4 border-purple-400;
  @apply bg-purple-50 rounded-r-lg;
  @apply text-purple-900;
  @apply italic;
}

.blockquote :deep(p) {
  @apply mb-2 last:mb-0;
}

.blockquote :deep(strong) {
  @apply font-semibold text-purple-900;
}
</style>

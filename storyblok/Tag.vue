<template>
  <span class="tag">
    {{ props.blok.text }}
  </span>
</template>

<script setup>
const props = defineProps({ blok: Object })
</script>

<style scoped>
.tag {
  @apply inline-block;
  @apply px-2;
  @apply py-1;
  @apply bg-purple-300;
  @apply text-sm;
  @apply rounded;
}
</style>
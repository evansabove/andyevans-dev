<template>
  <div class="blog-section-heading">{{ blok.text }}</div>
</template>

<script setup lang="ts">

defineProps({ blok: Object })
</script>

<style scoped>
.blog-section-heading {
    @apply text-3xl font-bold;
    @apply mb-5;
}
</style>
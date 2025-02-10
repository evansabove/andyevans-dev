<template>
  <div v-editable="blok">
    <div class="blog-title">{{ blok.Title }}</div>
    <div class="blog-description">{{ blok.Description }}</div>

    <div class="blog-content">
      {{ blok.Content }}
    </div>
  </div>
</template>

<script setup>
defineProps({ blok: Object })
</script>

<style scoped>
.blog-title {
  @apply text-4xl font-bold;
  @apply mb-3;
}

.blog-description {
  margin-bottom: 2rem;
}
</style>
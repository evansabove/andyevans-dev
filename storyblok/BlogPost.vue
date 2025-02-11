<template>
  <div v-editable="blok">
    <div class="blog-title">{{ blok.Title }}</div>
    <div class="blog-description">{{ blok.Description }}</div>
    <div class="blog-image">
      <img :src="blok.Image.filename" alt="Blog Image" />
    </div>

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
  @apply italic;
}

.blog-image {
  max-height: 20rem;
  overflow: hidden;
  background-size: cover;
}
</style>
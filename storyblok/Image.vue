<template>
  <div class="image-container">
    <img class="image" :src="blok.Image?.filename" :alt="blok.Image?.alt"/>
    <p class="image-caption">{{ blok.Image?.title }}</p>
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object })
</script>

<style scoped>
.image-container {
  @apply flex flex-col justify-center items-center;
  @apply mb-10;
}

.image {
  @apply w-full;
  @apply md:max-w-[calc(100%/3)];
  @apply lg:max-w-[calc(50%)];
  @apply sm:max-w-[calc(50%)];
  @apply rounded-lg;
}
</style>
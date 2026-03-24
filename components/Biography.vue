<template>
  <div class="bio">
    <img class="bio__image" :src="image" :alt="imageAlt" />
    <div class="bio__text" v-html="text" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  imageAlt?: string
  text: string
}>()
</script>

<style scoped>
.bio {
  @apply flex flex-col md:flex-row;
  @apply mb-10;

  &__image {
    @apply rounded-lg;
    @apply mb-5;
    width: 18rem;
    height: 18rem;
    object-fit: cover;
    @apply md:mb-0;
  }

  &__text {
    @apply md:ml-4;
    @apply text-lg;
  }
}
</style>

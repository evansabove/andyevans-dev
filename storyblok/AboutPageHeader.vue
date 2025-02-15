<template>
  <div class="about-container">
    <StoryblokComponent :blok="blok.CodeBlock[0]" />
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object })

</script>

<style scoped>
.about-container {
  @apply flex;
  flex-grow: 1;
  align-items: center;
}

.about-image {
  border-radius: 50%;
  object-fit: cover;
  height: 10rem;
  @apply mb-10;
}
</style>

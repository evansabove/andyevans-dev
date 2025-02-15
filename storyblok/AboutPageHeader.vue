<template>
  <div class="about-container">
    <StoryblokComponent :blok="blok.CodeBlock[0]" />
    <img :src="blok.Image.filename" {{ blok }} class="about-image" />
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object })

</script>

<style scoped>
.about-container {
  @apply flex;
  flex-grow: 1;
}

.about-image {
  border-radius: 50%;
  object-fit: cover;
}
</style>

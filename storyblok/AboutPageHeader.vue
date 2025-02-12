<template>
  <div class="about-container">
    <StoryblokComponent :blok="blok.CodeBlock[0]" class="code-block" />
    <img :src="blok.Image.filename" {{ blok }} class="about-image" />
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object })

</script>

<style scoped>
.about-container {
  @apply flex gap-5;
}

.about-image {
  border-radius: 50%;
  object-fit: cover;
  height: 12rem;
  width: 12rem;
}

.code-block {
  flex-grow: 1;
}
</style>

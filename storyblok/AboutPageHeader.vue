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
  @apply flex w-full;
  flex-grow: 1;
}
</style>

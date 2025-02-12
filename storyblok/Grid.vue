<template>
  <div class="grid-container">
    <div v-for="column in blok.columns">
      <StoryblokComponent :blok="column" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object })


</script>

<style scoped>
.grid-container {
  @apply flex justify-between;
}
</style>
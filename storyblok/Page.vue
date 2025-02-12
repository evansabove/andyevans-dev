<template>
  <div v-editable="blok">
    <StoryblokComponent v-for="blok in blok.body" :key="blok._uid" :blok="blok" class="blok" />
  </div>
</template>

<script setup>
defineProps({ blok: Object })
</script>

<style scoped>
.blok {
  @apply flex;
}
</style>
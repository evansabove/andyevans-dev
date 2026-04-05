<template>
  <div class="tag-list">
    <Tag v-for="tag in tags" :key="tag" :tag="tag" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ 
  tags: string[]
}>()
</script>

<style scoped>
.tag-list {
  @apply flex flex-wrap;
}
</style>

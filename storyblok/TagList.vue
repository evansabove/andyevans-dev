<template>
  <div class="tag-list">
    <span v-for="tag in props.bloks" :key="tag" class="tag">
      <Tag :blok="tag" />
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  bloks: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.tag-list {
  @apply flex;
  @apply gap-2;
  @apply flex-wrap;
}
</style>
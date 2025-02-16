<template>
  <div class="blog-section-container">
    <div v-html="html" />
  </div>
</template>

<script setup lang="ts">
import { richTextResolver } from '@storyblok/richtext'

const props = defineProps({ blok: Object })

const { render } = richTextResolver()

const renderedSections = render(props.blok.Text.content) as []
const html = renderedSections.join('<br />')
</script>

<style scoped>
.blog-section-container {
  @apply flex flex-col;
  @apply mb-10;
}
</style>
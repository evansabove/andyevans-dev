<template>
  <div class="blog-section-container">
    <div class="blog-section blog-section__heading">{{ blok.Heading }}</div>
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
  @apply mb-5;
}
.blog-section {
  @apply mb-10;

  &__heading {
    @apply text-3xl font-bold;
    @apply mb-5;
  }
}
</style>
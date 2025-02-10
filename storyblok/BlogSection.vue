<template>
  <div class="blog-section blog-section__heading">{{ blok.Heading }}</div>

  <div class="blog-section blog-section__content" v-html="html" />
</template>

<script setup lang="ts">
import { richTextResolver } from '@storyblok/richtext'

const props = defineProps({ blok: Object })

const { render } = richTextResolver()
const html = render(props.blok.Text.content)
</script>

<style scoped>
.blog-section {
  @apply mb-10;

  &__heading {
    @apply text-3xl font-bold;
  }

  &__content {}
}
</style>
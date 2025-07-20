<template>
  <div class="bio">
    <img class="bio__image" :src="blok.Image?.filename" :alt="blok.Image?.alt" />
    <div class="bio__text" v-html="html" />
  </div>
</template>

<script setup lang="ts">
import { richTextResolver } from '@storyblok/richtext'

const props = defineProps({ blok: Object })

const { render } = richTextResolver()

const html = render(props.blok.Text)
</script>

<style scoped>
.bio {
  @apply flex flex-col md:flex-row;
  @apply mb-10;

  &__image {
    @apply rounded-lg;
    @apply mb-5;
    width: 18rem;
    height: 18rem;
    object-fit: cover;
    @apply md:mb-0;
  }

  &__text {
    @apply md:ml-4;
    @apply text-lg;
  }
}
</style>
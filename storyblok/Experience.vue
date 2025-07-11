<template>
  <div class="experience">
    <div class="experience-title">
      {{ props.blok.title }}
    </div>
    <div class="experience-business">
      {{ props.blok.business }}
    </div>
    <div class="experience-date">
      {{ $dayjs(props.blok.start).format("MMM YYYY") }} -
      {{ props.blok.end ? $dayjs(props.blok.end).format("MMM YYYY") : 'Present' }}
    </div>
    <div class="experience-location">
      📍 {{ props.blok.location }}
    </div>

    <div class="experience-tags">
      <TagList :bloks="props.blok.tags" />
    </div>

    <div class="experience-summary" v-html="html" />
  </div>
</template>

<script setup lang="ts">
import { richTextResolver } from '@storyblok/richtext'

const props = defineProps({ blok: Object })

const { render } = richTextResolver()

const renderedSections = render(props.blok.summary.content) as []
const html = renderedSections.join('<br />')
</script>

<style scoped>
.experience {
  @apply flex flex-col;
  @apply mb-20;

  &-title {
    @apply font-bold;
    @apply text-lg;
  }

  &-summary {
    @apply mt-5;
  }

  &-tags {
    @apply mt-2;
  };
}
</style>
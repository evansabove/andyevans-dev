<template>
  <div class="experience">
    <div class="experience-header">
      <div class="experience-logo" v-if="props.blok.logo">
        <img :src="props.blok.logo.filename" alt="Company Logo" />
      </div>

      <div class="experience-meta">
        <div class="experience-title">
          {{ props.blok.title }}
        </div>

        <div class="experience-business">
          {{ props.blok.business }}
        </div>
      </div>
    </div>
  </div>

  <div class="experience-body">
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

  &-header {
    @apply flex flex-row;
    @apply mb-2;
  }

  &-logo {
    @apply mr-3;
    width: 60px;
    height: 60px;
  }

  &-details {
    @apply flex flex-col;
    @apply mb-20;
  }

  &-title {
    @apply font-bold;
    @apply text-lg;
  }

  &-summary {
    @apply mt-5;
    @apply mb-20;
  }

  &-tags {
    @apply mt-5;
  }

  ;
}
</style>
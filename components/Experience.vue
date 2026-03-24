<template>
  <div class="experience">
    <div class="experience-header">
      <div class="experience-logo" v-if="logo">
        <img :src="logo" alt="Company Logo" />
      </div>

      <div class="experience-meta">
        <div class="experience-title">{{ title }}</div>
        <div class="experience-business">{{ business }}</div>
      </div>
    </div>
  </div>

  <div class="experience-body">
    <div class="experience-date">
      {{ $dayjs(start).format("MMM YYYY") }} -
      {{ end ? $dayjs(end).format("MMM YYYY") : 'Present' }}
    </div>

    <div class="experience-location">
      📍 {{ location }}
    </div>
    <div class="experience-tags">
      <TagList :tags="tags ?? []" />
    </div>

    <div class="experience-summary">{{ summary }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  business: string
  start: string
  end?: string | null
  location: string
  tags?: string[]
  summary?: string
  logo?: string
}>()
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
}
</style>

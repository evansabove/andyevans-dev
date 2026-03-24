<template>
  <div class="education">
    <div class="education-header">
      <div class="education-logo" v-if="logo">
        <img :src="logo" alt="Logo" />
      </div>

      <div class="education-meta">
        <div class="education-course">{{ course }}</div>
        <div class="education-study-location">{{ study_location }}</div>
      </div>
    </div>

    <div class="education-year">Years {{ year_start }} - {{ year_end }}</div>
    <div class="education-grade">Grade {{ grade }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  course: string
  study_location: string
  year_start: number
  year_end: number
  grade?: string
  logo?: string
}>()
</script>

<style scoped>
.education {
  @apply flex flex-col;
  @apply mb-10;

  &-header {
    @apply flex flex-row;
    @apply mb-2;
  }

  &-logo {
    @apply mr-3;
    width: 60px;
    height: 60px;
  }

  &-course {
    @apply font-bold;
    @apply text-lg;
  }

  &-study-location {
    @apply mb-5;
  }
}
</style>

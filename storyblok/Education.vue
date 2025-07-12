<template>
  <div class="education">
    <div class="education-header">
      <div class="education-logo" v-if="props.blok.logo">
        <img :src="props.blok.logo.filename" alt="Logo" />
      </div>

      <div class="education-meta">
        <div class="education-course">
          {{ props.blok.course }}
        </div>

        <div class="education-study-location">
          {{ props.blok.study_location }}
        </div>
      </div>
    </div>

    <div class="education-year">
      Years {{ props.blok.year_start }} - {{ props.blok.year_end }}
    </div>
    <div class="education-grade">
      Grade {{ props.blok.grade }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({ blok: Object })

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
    height: 60px;;
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
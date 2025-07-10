<template>
  <div class="education">
    <div class="education-course">
      🎓 {{ props.blok.course }}
    </div>

    <div class="education-study-location">
      📍 {{ props.blok.study_location }}
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

  &-course {
    @apply font-bold;
  }

  &-study-location {
    @apply mb-5;
  }
}
</style>
<template>
  <div class="certification">
    <div class="certification-name">
      {{ props.blok.name }}
    </div>

    <div class="certification-issuer">
      {{ props.blok.issuer }}
    </div>

    <div class="certification-issued">
      Issued: {{ props.blok.issued }}
    </div>

    <div class="certification-expires">
      Expires: {{ props.blok.expires }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({ blok: Object })
</script>

<style scoped>
.certification {
  @apply flex flex-col;
  @apply mb-20;

  &-name {
    @apply font-bold;
    @apply text-lg;
  }
}
</style>
<template>
  <div class="certification">
    <div class="certification-name">{{ name }}</div>
    <div class="certification-issuer">{{ issuer }}</div>
    <div class="certification-issued">Issued: {{ issued }}</div>
    <div class="certification-expires" v-if="expires">Expires: {{ expires }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  issuer: string
  issued: string
  expires?: string
}>()
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

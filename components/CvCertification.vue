<template>
  <div class="cert">
    <div class="cert__header">
      <div>
        <p class="cert__name">{{ name }}</p>
        <p class="cert__issuer">{{ issuer }}</p>
      </div>
      <div class="cert__meta">
        <p class="cert__issued">Issued {{ issued }}</p>
        <p v-if="expires" class="cert__expires">Expires {{ expires }}</p>
      </div>
    </div>
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
.cert {
  @apply border border-stone-200 rounded-lg p-5 mb-4 bg-white;
}

.cert__header {
  @apply flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1;
}

.cert__name {
  @apply font-semibold text-purple-900;
}

.cert__issuer {
  @apply text-gray-600;
}

.cert__meta {
  @apply text-sm text-gray-500 sm:text-right;
}

.cert__issued {
  @apply font-medium;
}

.cert__expires {
  @apply italic;
}
</style>

<template>
  <div class="cert">
    <div class="cert__header">
      <div>
        <h3 class="cert__name">
          <a v-if="credentialUrl" :href="credentialUrl" target="_blank" rel="noopener">{{ name }}</a>
          <template v-else>{{ name }}</template>
        </h3>
        <p class="cert__issuer">{{ issuer }}</p>
      </div>
      <div class="cert__meta">
        <p class="cert__issued">Issued {{ issued }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No expiry is shown: this certification is kept current through renewal, and an expiry date
// on the page only ever reads as a countdown to being out of date.
defineProps<{
  name: string
  issuer: string
  issued: string
  credentialUrl?: string | null
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
  /* override the global h3 sizing and margins */
  font-size: 1.0625rem !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.cert__issuer {
  @apply text-gray-600;
  margin-bottom: 0;
}

.cert__meta {
  @apply text-sm text-gray-500 sm:text-right flex-shrink-0;
}

.cert__issued {
  @apply font-medium;
  margin-bottom: 0;
}
</style>

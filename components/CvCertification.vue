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
        <p v-if="expires" class="cert__expires">
          <span v-if="hasExpired" class="cert__expired-badge">Expired {{ expires }}</span>
          <span v-else>Expires {{ expires }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  issuer: string
  issued: string
  expires?: string
  credentialUrl?: string | null
}>()

// Certifications lapse quietly. Render the real state rather than a stale "Expires" label.
const hasExpired = computed(() => {
  if (!props.expires) return false
  const parsed = new Date(`1 ${props.expires}`)
  if (Number.isNaN(parsed.getTime())) return false
  // Treat the expiry month as valid through to its end.
  const endOfExpiryMonth = new Date(parsed.getFullYear(), parsed.getMonth() + 1, 0)
  return endOfExpiryMonth < new Date()
})
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

.cert__expires {
  margin-bottom: 0;
}

.cert__expired-badge {
  @apply inline-block bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 text-xs font-semibold;
}
</style>

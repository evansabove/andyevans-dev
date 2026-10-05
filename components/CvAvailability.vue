<template>
  <aside class="availability" aria-labelledby="availability-heading">
    <p class="availability__status">
      <span class="availability__dot" aria-hidden="true" />
      {{ status }}
    </p>
    <p v-if="text" class="availability__text">{{ text }}</p>

    <dl class="availability__details">
      <div v-if="roles?.length" class="availability__detail">
        <dt class="availability__label">Roles</dt>
        <dd class="availability__value">
          <ul class="availability__roles">
            <li v-for="role in roles" :key="role">{{ role }}</li>
          </ul>
        </dd>
      </div>
      <div v-if="location" class="availability__detail">
        <dt class="availability__label">Location</dt>
        <dd class="availability__value">{{ location }}</dd>
      </div>
    </dl>

    <a v-if="contactUrl" :href="contactUrl" target="_blank" rel="noopener" class="availability__cta">
      {{ contactLabel ?? 'Get in touch' }}
    </a>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  status: string
  text?: string
  roles?: string[]
  industries?: string[]
  location?: string
  contactUrl?: string
  contactLabel?: string
}>()
</script>

<style scoped>
.availability {
  @apply border border-purple-200 bg-purple-50 rounded-lg p-5 mb-8;
}

.availability__status {
  @apply flex items-center gap-2;
  @apply text-sm font-semibold text-purple-800 uppercase tracking-wide mb-2;
}

.availability__dot {
  @apply inline-block w-2 h-2 rounded-full bg-green-500 flex-shrink-0;
}

.availability__heading {
  @apply text-lg font-bold text-purple-900 mb-2;
  /* override the global h2 sizing and margins */
  font-size: 1.125rem !important;
  margin-top: 0 !important;
  margin-bottom: 0.5rem !important;
}

.availability__text {
  @apply text-gray-700 leading-relaxed mb-4;
}

.availability__details {
  @apply grid gap-3 sm:grid-cols-2 mb-4;
}

.availability__label {
  @apply text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1;
}

.availability__value {
  @apply text-gray-700;
}

.availability__roles {
  @apply list-none;
  margin: 0;
  padding: 0;

  li {
    @apply my-0.5;
    padding: 0;
  }
}

.availability__cta {
  @apply inline-flex items-center;
  @apply bg-purple-900 text-white;
  @apply px-4 py-2 rounded-md;
  @apply font-medium no-underline;
  @apply hover:bg-purple-700 transition-colors;
}
</style>

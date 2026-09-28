<template>
  <article class="experience">
    <div class="experience__header">
      <div>
        <h3 class="experience__title">{{ title }}</h3>
        <p class="experience__business">{{ business }}</p>
      </div>
      <div class="experience__meta">
        <p class="experience__dates">
          <time :datetime="start">{{ formatDate(start) }}</time>
          –
          <time v-if="end" :datetime="end">{{ formatDate(end) }}</time>
          <span v-else>Present</span>
        </p>
        <p class="experience__location">{{ location }}</p>
      </div>
    </div>
    <p v-if="summary" class="experience__summary">{{ summary }}</p>
    <ul v-if="highlights?.length" class="experience__highlights">
      <li v-for="(highlight, i) in highlights" :key="i">{{ highlight }}</li>
    </ul>
    <p v-if="links?.length" class="experience__links">
      <a
        v-for="link in links"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener"
        class="experience__link"
      >{{ link.label }} ↗</a>
    </p>
    <div v-if="tags?.length" class="experience__tags">
      <CvChips :items="tags" />
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  business: string
  start: string
  end?: string | null
  location?: string
  summary?: string
  highlights?: string[]
  links?: { label: string, url: string }[]
  tags?: string[]
}>()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
.experience {
  @apply border border-stone-200 rounded-lg p-5 mb-4 bg-white;
}

.experience__header {
  @apply flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2;
}

.experience__title {
  @apply font-semibold text-purple-900;
  /* override the global h3 sizing and margins */
  font-size: 1.0625rem !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.experience__business {
  @apply text-gray-600;
  margin-bottom: 0;
}

.experience__meta {
  @apply text-sm text-gray-500 sm:text-right flex-shrink-0;
}

.experience__dates {
  @apply font-medium;
  margin-bottom: 0;
}

.experience__location {
  margin-bottom: 0;
}

.experience__summary {
  @apply text-gray-700 mt-2;
  margin-bottom: 0;
}

.experience__highlights {
  @apply text-gray-700 text-sm mt-3;
  @apply list-disc ms-5;
  margin-bottom: 0;

  li {
    @apply my-1.5;
  }
}

.experience__links {
  @apply flex flex-wrap gap-4 mt-3;
  margin-bottom: 0;
}

.experience__link {
  @apply text-sm font-semibold text-purple-700 no-underline;
}

.experience__link:hover {
  @apply underline;
}

.experience__tags {
  @apply mt-4;
}
</style>

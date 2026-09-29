<script setup lang="ts">
// The source for the downloadable PDF. scripts/generate-cv-pdf.mjs renders this page to
// andy-evans-cv.pdf at build time, so the PDF always matches content/pages/cv.yml.
// It is not meant to be found on its own: /cv is the page people and search engines should see.
const runtimeConfig = useRuntimeConfig()

const { cv, selectedWriting } = await useCv()

// Becomes the PDF's document title, which is what shows in a recruiter's PDF viewer.
const pageTitle = computed(() => `${cv.value.title ?? 'Andy Evans'} | CV`)

useHead({
  titleTemplate: () => pageTitle.value,
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  link: [{ rel: 'canonical', href: `${runtimeConfig.public.appUrl}/cv/` }],
})
</script>

<template>
  <main class="cv-print">
    <CvDocument :cv="cv" :writing="selectedWriting" print />
  </main>
</template>

<style scoped>
.cv-print {
  @apply bg-white;
  padding: 0;
}
</style>

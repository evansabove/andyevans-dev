<script setup lang="ts">
// The source for the downloadable PDFs. scripts/generate-cv-pdf.mjs renders /about/print/ and
// /about/print/<variant>/ to their PDFs at build time, so they always match content/pages/cv.yml.
// They are not meant to be found on their own: /about is the page people and search engines should see.
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

// No segment is the default (software) CV, so it isn't also served under its own key.
const [defaultVariant, ...otherVariants] = CV_VARIANTS
const variant = route.params.variant
  ? otherVariants.find(v => v.key === route.params.variant)
  : defaultVariant
if (!variant) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { cv, selectedWriting } = await useCv(variant.key)

// Becomes the PDF's document title, which is what shows in a recruiter's PDF viewer.
const pageTitle = computed(() => `${cv.value.title ?? 'Andy Evans'} | CV`)

useHead({
  titleTemplate: () => pageTitle.value,
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  link: [{ rel: 'canonical', href: `${runtimeConfig.public.appUrl}/about/` }],
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

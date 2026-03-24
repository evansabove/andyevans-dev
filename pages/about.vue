<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const { data: aboutData } = await useAsyncData('about-page', () =>
  queryCollection('posts').path('about').first()
)

useHead({
  title: 'About',
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
})

useSeoMeta({
  ogTitle: 'About | Andy Evans',
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: 'About | Andy Evans',
  twitterDescription: runtimeConfig.public.appDescription,
  twitterImage: runtimeConfig.public.appImage,
})
</script>

<template>
  <AppTemplate>
    <div class="about-page">
      <Biography
        v-if="aboutData?.biography"
        :image="aboutData.biography.image"
        :image-alt="aboutData.biography.imageAlt"
        :text="aboutData.biography.text"
      />

      <template v-if="aboutData?.experience?.length">
        <h2 class="section-heading">Experience</h2>
        <Experience
          v-for="(exp, i) in aboutData.experience"
          :key="i"
          v-bind="exp"
        />
      </template>

      <template v-if="aboutData?.education?.length">
        <h2 class="section-heading">Education</h2>
        <Education
          v-for="(edu, i) in aboutData.education"
          :key="i"
          v-bind="edu"
        />
      </template>

      <template v-if="aboutData?.certifications?.length">
        <h2 class="section-heading">Certifications</h2>
        <Certification
          v-for="(cert, i) in aboutData.certifications"
          :key="i"
          v-bind="cert"
        />
      </template>
    </div>
  </AppTemplate>
</template>

<style scoped>
.about-page {
  @apply flex flex-col;
}

.section-heading {
  @apply text-2xl font-bold mt-10 mb-6;
}
</style>

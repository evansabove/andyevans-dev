<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const { data: cvData } = await useAsyncData('cv-page', async () => {
  const result = await queryCollection('pages').where('stem', '=', 'pages/cv').first()
  return result ?? {}
})

useHead({
  title: 'CV',
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
})

useSeoMeta({
  ogTitle: 'CV | Andy Evans',
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path.replace(/\/$/, '')}`),
})
</script>

<template>
  <AppTemplate>
    <div class="cv">
      <h1 class="cv__heading">Andy Evans</h1>
      <p class="cv__subtitle">Software Engineer · Sheffield, UK</p>
      <template v-if="cvData?.biography?.text">
        <h2 class="cv__section">About Me</h2>
        <div class="cv__bio" v-html="cvData.biography.text" />
      </template>

      <template v-if="cvData?.meta?.aboutMe?.length">
        <CvAboutMe
          v-for="(about, i) in cvData.meta.aboutMe"
          :key="i"
          v-bind="about"
        />
      </template>

      <template v-if="cvData?.meta?.experience?.length">
        <h2 class="cv__section">Experience</h2>
        <CvExperience
          v-for="(exp, i) in cvData.meta.experience"
          :key="i"
          v-bind="exp"
        />
      </template>

      <template v-if="cvData?.meta?.education?.length">
        <h2 class="cv__section">Education</h2>
        <CvEducation
          v-for="(edu, i) in cvData.meta.education"
          :key="i"
          v-bind="edu"
        />
      </template>

      <template v-if="cvData?.meta?.certifications?.length">
        <h2 class="cv__section">Certifications</h2>
        <CvCertification
          v-for="(cert, i) in cvData.meta.certifications"
          :key="i"
          v-bind="cert"
        />
      </template>
    </div>
  </AppTemplate>
</template>

<style scoped>
.cv {
  @apply max-w-3xl mx-auto;
}

.cv__heading {
  @apply text-3xl font-bold text-purple-900 mb-1;
}

.cv__subtitle {
  @apply text-gray-500 mb-8;
}

.cv__section {
  @apply text-xl font-bold text-purple-900 mt-8 mb-4 pb-2;
  @apply border-b border-stone-200;
}
.cv__bio {
  @apply text-gray-700 leading-relaxed;
}

.cv__bio p {
  @apply mb-3;
}
</style>

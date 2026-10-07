<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const { cv, selectedWriting } = await useCv()

const pageTitle = computed(() => `${cv.value.title ?? 'Andy Evans'} | About me`)
const pageDescription = computed(() => cv.value.description ?? runtimeConfig.public.appDescription)
const pageUrl = computed(() => `${runtimeConfig.public.appUrl}${route.path.replace(/\/?$/, '/')}`)

useHead({
  titleTemplate: () => pageTitle.value,
})

// app.vue sets blog-oriented keywords site-wide; override them for the CV.
const pageKeywords = computed(() =>
  (cv.value.skills ?? []).flatMap((group: any) => group.items ?? []).join(', '),
)

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  keywords: pageKeywords,
  description: pageDescription,
  ogDescription: pageDescription,
  ogType: 'profile',
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: runtimeConfig.public.appImage,
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
})

// Structured data is how AI search and recruiter tooling read a CV, so mirror the whole
// document into schema.org rather than just the headline facts.
const personSchema = computed(() => {
  const skills: string[] = (cv.value.skills ?? []).flatMap((group: any) => group.items ?? [])
  const experience: any[] = cv.value.experience ?? []
  const current = experience.find(role => !role.end && role.type !== 'break')

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: pageUrl.value,
    mainEntity: {
      '@type': 'Person',
      '@id': `${runtimeConfig.public.appUrl}/#andy-evans`,
      name: 'Andy Evans',
      givenName: 'Andy',
      familyName: 'Evans',
      jobTitle: cv.value.role ?? 'Senior / Lead Software Engineer',
      description: pageDescription.value,
      url: pageUrl.value,
      image: runtimeConfig.public.appImage,
      ...(cv.value.email ? { email: cv.value.email } : {}),
      knowsAbout: skills,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sheffield',
        addressRegion: 'South Yorkshire',
        addressCountry: 'GB',
      },
      ...(current
        ? {
            worksFor: { '@type': 'Organization', name: current.business },
            hasOccupation: {
              '@type': 'Occupation',
              name: current.title,
              occupationalCategory: '15-1252.00',
              skills: skills.join(', '),
              occupationLocation: { '@type': 'Country', name: 'United Kingdom' },
            },
          }
        : {}),
      alumniOf: (cv.value.education ?? []).map((edu: any) => ({
        '@type': 'EducationalOrganization',
        name: edu.study_location,
      })),
      hasCredential: (cv.value.certifications ?? []).map((cert: any) => ({
        '@type': 'EducationalOccupationalCredential',
        name: cert.name,
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: cert.issuer },
      })),
      sameAs: [
        'https://www.linkedin.com/in/andy-evans-557b1125',
        'https://github.com/evansabove',
      ],
    },
  }
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(personSchema.value)),
    },
  ],
})
</script>

<template>
  <AppTemplate>
    <CvDocument :cv="cv" :writing="selectedWriting" />
  </AppTemplate>
</template>


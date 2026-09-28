<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const { data: cvData } = await useAsyncData('cv-page', async () => {
  const result = await queryCollection('pages').where('stem', '=', 'pages/cv').first()
  return result ?? {}
})

// Nuxt Content puts unschema'd fields from a data collection under `meta`. Fall back to the
// top level so a change to the collection schema can't silently blank the page.
const cv = computed<Record<string, any>>(() => (cvData.value as any)?.meta ?? (cvData.value as any) ?? {})

// The posts are the strongest evidence of the skills claimed above, so link the technical ones.
const { data: writing } = await useAsyncData('cv-writing', () => {
  const query = queryCollection('posts').order('date', 'DESC')
  if (!import.meta.dev) query.where('draft', '<>', true)
  return query.all()
})

const nonTechnicalTags = ['Automotive']
const selectedWriting = computed(() =>
  (writing.value ?? [])
    .filter(post => !(post.tags ?? []).some((tag: string) => nonTechnicalTags.includes(tag)))
    .slice(0, 4)
)

const pageTitle = computed(() => `${cv.value.title ?? 'Andy Evans'} | CV`)
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
      jobTitle: cv.value.role ?? 'Senior Software Engineer',
      description: pageDescription.value,
      url: pageUrl.value,
      image: runtimeConfig.public.appImage,
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
    <div class="cv">
      <header class="cv__masthead">
        <img
          v-if="cv.biography?.image"
          :src="cv.biography.image"
          :alt="cv.biography.imageAlt ?? 'Andy Evans'"
          class="cv__photo"
          width="128"
          height="128"
          loading="eager"
          fetchpriority="high"
        >
        <div>
          <h1 class="cv__heading">Andy Evans</h1>
          <p class="cv__subtitle">{{ cv.role ?? 'Senior Software Engineer' }} · {{ cv.location ?? 'Sheffield, UK' }}</p>
        </div>
      </header>

      <CvAvailability v-if="cv.availability" v-bind="cv.availability" />

      <template v-if="cv.biography?.text">
        <h2 class="cv__section">About me</h2>
        <div class="cv__bio" v-html="cv.biography.text" />
      </template>

      <template v-if="cv.skills?.length">
        <h2 class="cv__section">Skills</h2>
        <CvSkills :groups="cv.skills" />
      </template>

      <template v-if="cv.experience?.length">
        <h2 class="cv__section">Experience</h2>
        <template v-for="(exp, i) in cv.experience" :key="i">
          <CvCareerBreak v-if="exp.type === 'break'" v-bind="exp" />
          <CvExperience v-else v-bind="exp" />
        </template>
      </template>

      <template v-if="cv.howIWork?.length">
        <h2 class="cv__section">How I work</h2>
        <div class="cv__panel">
          <CvHowIWork
            v-for="(item, i) in cv.howIWork"
            :key="i"
            v-bind="item"
          />
        </div>
      </template>

      <template v-if="cv.education?.length">
        <h2 class="cv__section">Education</h2>
        <CvEducation
          v-for="(edu, i) in cv.education"
          :key="i"
          v-bind="edu"
        />
      </template>

      <template v-if="cv.certifications?.length">
        <h2 class="cv__section">Certifications</h2>
        <CvCertification
          v-for="(cert, i) in cv.certifications"
          :key="i"
          v-bind="cert"
        />
      </template>

      <template v-if="selectedWriting.length">
        <h2 class="cv__section">Selected writing</h2>
        <div class="cv__panel">
          <p class="cv__writing-intro">
            I write up the problems I solve. These are a good way to see how I work in practice.
          </p>
          <ul class="cv__writing">
            <li v-for="post in selectedWriting" :key="post.path">
              <NuxtLink :to="post.path" class="cv__writing-link">{{ post.title }}</NuxtLink>
              <span class="cv__writing-desc">{{ post.description }}</span>
            </li>
          </ul>
          <NuxtLink to="/posts" class="cv__writing-all">Read all posts →</NuxtLink>
        </div>
      </template>
    </div>
  </AppTemplate>
</template>

<style scoped>
.cv {
  @apply max-w-3xl mx-auto;
}

.cv__masthead {
  @apply flex items-center gap-5 mb-8;
}

.cv__photo {
  @apply rounded-full border-4 border-white shadow-md flex-shrink-0;
  width: 8rem;
  height: 8rem;
  object-fit: cover;
  object-position: top;
  /* override the global img centering and margins */
  margin: 0 !important;
}

.cv__heading {
  @apply text-3xl font-bold text-purple-900;
  margin-bottom: 0.25rem !important;
}

.cv__subtitle {
  @apply text-gray-500;
  margin-bottom: 0;
}

.cv__section {
  @apply text-xl font-bold text-purple-900 mt-8 mb-4 pb-2;
  @apply border-b border-stone-200;
  font-size: 1.25rem !important;
}

.cv__panel {
  @apply border border-stone-200 rounded-lg p-5 bg-white;
}

.cv__bio {
  @apply text-gray-700 leading-relaxed;
}

.cv__bio p:last-child {
  margin-bottom: 0;
}

.cv__writing-intro {
  @apply text-gray-700;
}

.cv__writing {
  @apply list-none;
  margin: 0;
  padding: 0;

  li {
    @apply mb-3 last:mb-0;
    padding: 0;
  }
}

.cv__writing-link {
  @apply block font-semibold text-purple-900 no-underline;
}

.cv__writing-link:hover {
  @apply underline;
}

.cv__writing-desc {
  @apply block text-gray-600 text-sm mt-0.5;
}

.cv__writing-all {
  @apply inline-block mt-4 font-bold text-purple-700;
}
</style>

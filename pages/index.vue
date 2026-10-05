<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

// Fetch home page data
const { data: homeData } = await useAsyncData('home-page', () =>
  queryCollection('pages').where('id', '=', 'pages/home.yml').first()
)

// The home page is the pitch and /cv is the full record, but both are driven by the same
// content file so the two can't drift apart.
const { data: cvData } = await useAsyncData('home-cv', async () => {
  const result = await queryCollection('pages').where('stem', '=', 'pages/cv').first()
  return result ?? {}
})
const cv = computed<Record<string, any>>(() => (cvData.value as any)?.meta ?? (cvData.value as any) ?? {})

// Enough skills to make the case, not so many that the posts get pushed off the page.
// Taken by position rather than by name, so renaming a category in cv.yml can't silently
// empty this section.
const HOME_SKILL_GROUPS = 4
const topSkills = computed(() => (cv.value.skills ?? []).slice(0, HOME_SKILL_GROUPS))

// Fetch 3 most recent posts for the RecentPosts section
const { data: recentPosts } = await useAsyncData('recent-posts-home', () => {
  const query = queryCollection('posts')
    .order('date', 'DESC')
    .limit(3)
  if (!import.meta.dev) query.where('draft', '<>', true)
  return query.all()
})

const pageTitle = 'Andy Evans — Senior Software Engineer'

useHead({
  titleTemplate: () => pageTitle,
})

useSeoMeta({
  ogTitle: pageTitle,
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: runtimeConfig.public.appUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: runtimeConfig.public.appDescription,
  twitterImage: runtimeConfig.public.appImage,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Andy Evans',
        url: runtimeConfig.public.appUrl,
      })
    },
    {
      type: 'application/ld+json',
      // Same @id as the CV page, so both are understood as one entity rather than two people
      // who happen to share a name.
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${runtimeConfig.public.appUrl}/#andy-evans`,
        name: 'Andy Evans',
        url: runtimeConfig.public.appUrl,
        image: runtimeConfig.public.appImage,
        jobTitle: 'Senior Software Engineer',
        description: runtimeConfig.public.appDescription,
        mainEntityOfPage: `${runtimeConfig.public.appUrl}/about/`,
        sameAs: [
          'https://github.com/evansabove',
          'https://www.linkedin.com/in/andy-evans-557b1125'
        ]
      })
    }
  ]
})
</script>

<template>
  <AppTemplate>
    <HomeHero />

    <section v-if="topSkills.length" class="home-skills">
      <h2 class="home-skills__heading">What I work with</h2>
      <CvSkills :groups="topSkills" />
      <NuxtLink to="/about" class="home-skills__link">Read more about me →</NuxtLink>
    </section>

    <RecentPosts
      :posts="recentPosts ?? []"
      :heading="homeData?.recentPostsHeading ?? 'Recent Posts'"
    />
  </AppTemplate>
</template>

<style scoped>
.home-skills {
  @apply max-w-4xl mx-auto mb-10;
}

.home-skills__heading {
  @apply text-xl font-bold text-purple-900 mb-2 pb-2;
  @apply border-b border-stone-200;
  font-size: 1.25rem !important;
  margin-top: 0 !important;
}

.home-skills__link {
  @apply inline-block mt-4 font-bold text-purple-700;
}
</style>

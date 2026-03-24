<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

// Fetch home page data
const { data: homeData } = await useAsyncData('home-page', () =>
  queryCollection('pages').where('id', '=', 'pages/home').first()
)

// Fetch 3 most recent posts for the RecentPosts section
const { data: recentPosts } = await useAsyncData('recent-posts-home', () =>
  queryCollection('posts')
    .order('date', 'DESC')
    .limit(3)
    .all()
)

useHead({
  titleTemplate: () => 'Andy Evans — Software Engineer',
})

useSeoMeta({
  ogTitle: 'Andy Evans — Software Engineer',
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: runtimeConfig.public.appUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Andy Evans — Software Engineer',
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
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Andy Evans',
        url: runtimeConfig.public.appUrl,
        image: runtimeConfig.public.appImage,
        jobTitle: 'Software Engineer',
        description: runtimeConfig.public.appDescription,
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
    <RecentPosts
      :posts="recentPosts ?? []"
      :heading="homeData?.recentPostsHeading ?? 'Recent Posts'"
    />
  </AppTemplate>
</template>

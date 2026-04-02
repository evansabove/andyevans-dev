<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const { data: posts } = await useAsyncData('blog-post-list', () => {
  const query = queryCollection('posts').order('date', 'DESC')
  if (!import.meta.dev) query.where('draft', '<>', true)
  return query.all()
})

useHead({
  title: 'Blog',
  titleTemplate: (t) => t ? `${t} | Andy Evans` : 'Andy Evans — Software Engineer',
})

useSeoMeta({
  ogTitle: 'Blog | Andy Evans',
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path}`),
  twitterCard: 'summary_large_image',
  twitterTitle: 'Blog | Andy Evans',
  twitterDescription: runtimeConfig.public.appDescription,
  twitterImage: runtimeConfig.public.appImage,
})
</script>

<template>
  <AppTemplate>
    <BlogPostList :posts="posts ?? []" />
  </AppTemplate>
</template>

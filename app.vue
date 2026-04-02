<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const canonicalUrl = computed(() => `${runtimeConfig.public.appUrl}${route.path}`)

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})

useSeoMeta({
  keywords: 'andy evans developer, tech blog, andy evans engineer'
})
</script>

<template>
  <NuxtPage />
</template>
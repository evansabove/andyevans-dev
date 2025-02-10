<script setup lang="ts">

const config = useRuntimeConfig()

useHead({
  title: config.public.appName,
})

</script>

<template>
  <NuxtPage />
</template>
<template>
  <header class="header">
    <nav>
      <div class="header-text">
        <NuxtLink to="/" class="no-underline">{{ config.public.appName }}</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<style scoped>
.header {
  @apply bg-purple-900;
}

.header-text {
  @apply text-white;
  @apply ps-5 py-5;
  @apply cursor-pointer;
  @apply text-xl;
}
</style>
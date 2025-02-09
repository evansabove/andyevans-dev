<template>
  <header class="header bg-purple-800 text-white">
    <nav>
      <h1>{{ config.public.appName }}</h1>
    </nav>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<style scoped>
.header {
  padding: 1rem 2rem;
  font-size: 1.2rem;
}
</style>
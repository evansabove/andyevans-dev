<script setup lang="ts">
import type { NuxtError } from '#app'
import AppTemplate from './components/AppTemplate.vue';

const props = defineProps({
  error: Object as () => NuxtError
})

const goToHome = () => clearError({ redirect: '/' })

const title = computed(() => props.error?.statusCode === 404 ? 'Page not found' : 'Error')

console.error(props.error)

</script>

<template>
  <AppTemplate>
    <div class="error-title">{{ title }}</div>
    <div>Head back to the home page, you might have more luck there!</div>
    <button class="home-button" @click="goToHome">Go to Home Page</button>
  </AppTemplate>
</template>
<style scoped>
.error-title {
  @apply text-4xl font-bold;
  @apply mb-3;
}

.home-button {
  @apply mt-5;
}
</style>
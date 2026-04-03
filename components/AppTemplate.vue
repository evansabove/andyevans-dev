<script setup lang="ts">
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

<template>
    <div class="app-wrapper bg-stone-100">
        <a href="#main-content" class="skip-link">Skip to Content</a>
        <Header />

        <main id="main-content" class="main-content">
            <slot />
        </main>

        <Footer />
    </div>
</template>

<style scoped>
.skip-link {
  @apply absolute -top-96 left-4 z-50 bg-white text-purple-900 px-4 py-2 rounded-md shadow-lg font-bold;
  @apply focus:top-4 transition-all duration-200 outline-none;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
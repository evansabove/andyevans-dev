<template>
  <header class="header">
    <div class="header-title">
      <NuxtLink to="/" class="header-link">{{ config.public.appName }}</NuxtLink>
    </div>

    <nav class="header-nav">
      <div class="header-hamburger">
        <Icon name="fa6-solid:bars" class="header-hamburger-icon" @click="menuExpanded = true" />
      </div>

      <div class="header-expanded-menu" v-if="menuExpanded">
        <div class="header-expanded-menu-exit">
          <Icon name="fa6-solid:xmark" @click="menuExpanded = false" />
        </div>

        <NuxtLink to="/" class="header-link" @click="menuExpanded = false">Home</NuxtLink>
        <NuxtLink to="/posts/" class="header-link" @click="menuExpanded = false">Posts</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const menuExpanded = ref(false);
</script>

<style scoped>
.header {
  @apply text-white;
  @apply bg-purple-900;
  @apply flex;
  @apply px-5 py-5;
  @apply text-xl;
  @apply gap-10;
  @apply justify-between;

  &-expanded-menu {
    @apply absolute;
    @apply top-0;
    @apply right-0;
    @apply bg-purple-900;
    @apply w-40;
    @apply p-5;
    @apply flex;
    @apply flex-col;
    @apply gap-5;
    @apply text-right;
    @apply rounded-bl-xl;

    &-exit {
      @apply text-right;
      @apply text-2xl;
      @apply cursor-pointer;
      @apply mb-5;
    }
  }

  &-nav {
    @apply flex;
    @apply gap-5;
  }

  &-link {
    @apply no-underline;
  }

  &-hamburger {
    &-icon {
      @apply text-2xl;
      @apply cursor-pointer;
    }
  }
}
</style>
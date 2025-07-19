<template>
  <header class="header">
    <div class="header-title">
      <NuxtLink to="/" class="header-link">{{ config.public.appName }}</NuxtLink>
    </div>

    <nav class="header-nav">
      <div class="header-nav-links">
        <NuxtLink to="/posts" class="header-link">Posts</NuxtLink>
      </div>

      <div class="header-hamburger">
        <Icon name="fa6-solid:bars" class="header-hamburger-icon" />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<style scoped>
.header {
  @apply text-white;
  @apply bg-purple-900;
  @apply flex;
  @apply px-5 py-5;
  @apply text-xl;
  @apply gap-10;
  @apply justify-between md:justify-start;

  &-nav {
    @apply flex;
    @apply gap-5;

    &-links {
      @apply flex;
      @apply gap-5;
      @apply hidden md:block;
    }
  }

  &-nav-links {
    @apply gap-5;
    @apply hidden md:flex;
  }

  &-divider {
    @apply hidden md:block;
  }

  &-link {
    @apply no-underline;
  }

  &-hamburger {
    &-icon {
      @apply text-2xl;
      @apply cursor-pointer;
      @apply md:hidden;
    }
  }
}
</style>
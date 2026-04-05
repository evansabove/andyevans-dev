<template>
  <header class="header">
    <NuxtLink to="/" class="header-brand">{{ config.public.appName }}</NuxtLink>

    <!-- Desktop nav -->
    <nav class="header-nav">
      <NuxtLink to="/" class="header-link" active-class="header-link--active" exact>Home</NuxtLink>
      <NuxtLink to="/posts" class="header-link" active-class="header-link--active">Posts</NuxtLink>
      <NuxtLink to="/topics" class="header-link" active-class="header-link--active">Topics</NuxtLink>
    </nav>

    <!-- Mobile hamburger -->
    <button class="header-hamburger" aria-label="Open menu" @click="open = true">
      <Icon name="fa6-solid:bars" />
    </button>

    <!-- Mobile menu -->
    <TransitionRoot appear :show="open" as="template">
      <Dialog as="div" @close="open = false" class="relative z-50 md:hidden">
        <!-- Backdrop -->
        <TransitionChild
          as="template"
          enter="transition opacity duration-200"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition opacity duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="header-backdrop" aria-hidden="true" />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="transition transform duration-250 ease"
          enter-from="translate-x-full"
          enter-to="translate-x-0"
          leave="transition transform duration-250 ease"
          leave-from="translate-x-0"
          leave-to="translate-x-full"
        >
          <DialogPanel class="header-mobile-menu">
            <button class="header-close" aria-label="Close menu" @click="open = false">
              <Icon name="fa6-solid:xmark" />
            </button>
            <NuxtLink to="/" class="header-link" active-class="header-link--active" exact @click="open = false">Home</NuxtLink>
            <NuxtLink to="/posts" class="header-link" active-class="header-link--active" @click="open = false">Posts</NuxtLink>
            <NuxtLink to="/topics" class="header-link" active-class="header-link--active" @click="open = false">Topics</NuxtLink>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'

const config = useRuntimeConfig()
const open = ref(false)
</script>

<style scoped>
.header {
  @apply flex items-center justify-start;
  @apply bg-purple-900 text-white;
  @apply px-6 py-4 gap-8;
  @apply sticky top-0 z-50;
}

.header-brand {
  @apply no-underline font-semibold text-xl;
}

.header-nav {
  @apply hidden md:flex gap-6;
}

.header-link {
  @apply no-underline text-white opacity-75 text-base;
  @apply border-b-2 border-transparent pb-0.5;
  @apply transition-opacity duration-150;

  &:hover { @apply opacity-100; }
  &--active { @apply opacity-100 border-white; }
}

/* Hamburger — mobile only */
.header-hamburger {
  @apply flex md:hidden ml-auto;
  @apply bg-transparent border-0 text-white text-2xl cursor-pointer;
}

/* Slide-in mobile menu */
.header-mobile-menu {
  @apply fixed top-0 right-0 h-full w-64 z-50;
  @apply bg-purple-900 flex flex-col gap-6 p-6;
  @apply shadow-xl md:hidden;
}

.header-close {
  @apply self-end bg-transparent border-0 text-white text-2xl cursor-pointer mb-2;
}

/* Backdrop */
.header-backdrop {
  @apply fixed inset-0 z-40;
  background: rgba(0, 0, 0, 0.4);
}
</style>
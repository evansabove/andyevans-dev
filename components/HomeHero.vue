<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__text">
        <p class="hero__greeting">Hey, I'm</p>
        <h1 class="hero__name">Andy Evans</h1>
        <p class="hero__title">Software Engineer · Sheffield, UK</p>
        <p class="hero__bio">I'm a software engineer based in Sheffield, UK. I build web applications, APIs and cloud infrastructure. I specialise in .NET, Azure and platform engineering — and I'm particularly interested in developer tooling, clean architecture and building great teams.</p>
        <p class="hero__bio">This is where I write about the things I'm building, the problems I'm solving, and the lessons I pick up along the way.</p>
        <div class="hero__links">
          <a href="https://github.com/evansabove" target="_blank" rel="noopener" class="hero__link">
            <Icon name="mdi:github" class="hero__link-icon" />
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/andy-evans-557b1125" target="_blank" rel="noopener" class="hero__link">
            <Icon name="mdi:linkedin" class="hero__link-icon" />
            LinkedIn
          </a>
        </div>
        <NuxtLink to="/posts" class="hero__all-posts">View all posts →</NuxtLink>
      </div>
      <div class="hero__photo-wrap">
        <img src="/andyevans.jpeg" alt="Andy Evans" class="hero__photo" width="256" height="256" fetchpriority="high" loading="eager" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero {
  @apply py-12 px-8;
  margin: -2rem -2rem 2rem -2rem;
}

.hero__inner {
  @apply max-w-4xl mx-auto;
  @apply flex flex-col-reverse md:flex-row items-center gap-10;
}

.hero__text {
  @apply flex-1;
}

.hero__greeting {
  @apply text-purple-500 font-semibold text-lg mb-1;
}

.hero__name {
  @apply text-4xl font-bold text-purple-900 mb-1;
  /* override the global h1 margin */
  margin-bottom: 0.25rem !important;
}

.hero__title {
  @apply text-gray-500 text-base mb-4;
}

.hero__bio {
  @apply text-gray-700 text-base leading-relaxed mb-6;
}

.hero__links {
  @apply flex gap-4;
}

.hero__link {
  @apply inline-flex items-center gap-1.5;
  @apply bg-purple-900 text-white;
  @apply px-4 py-2 rounded-md;
  @apply text-sm font-medium no-underline;
  @apply hover:bg-purple-700 transition-colors;
}

.hero__link-icon {
  @apply w-5 h-5;
}

.hero__photo-wrap {
  @apply flex-shrink-0;
}

.hero__photo {
  width: 16rem;
  height: 16rem;
  object-fit: cover;
  object-position: top;
  @apply rounded-full;
  @apply shadow-lg;
  @apply border-4 border-white;
  /* override global img centering */
  margin: 0 !important;
}
.hero__all-posts {
  @apply mt-8 font-bold text-purple-700;
  display: inline-block;
}
</style>

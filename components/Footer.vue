<template>
  <footer class="footer bg-purple-900 text-white py-2">
    <div class="footer-content">
      <p>&copy; {{ new Date().getFullYear() }} {{ config.public.appName }}</p>
      <div class="icon-set">
        <a href="https://github.com/evansabove" target="_blank" aria-label="Andy Evans GitHub"> 
          <Icon name="fa6-brands:square-github" class="icon" />
        </a>

        <a href="https://www.linkedin.com/in/andy-evans-557b1125/" target="_blank" aria-label="Andy Evans LinkedIn">
          <Icon name="fa6-brands:linkedin" class="icon" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<style scoped>
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 0.8rem;
}

.icon-set {
  @apply flex justify-center;
  @apply mt-3;

  gap: 2rem;
}

.icon {
  color: white;
  font-size: 2rem;
}
</style>
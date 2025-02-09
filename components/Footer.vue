<template>
  <footer class="footer bg-purple-800 text-white py-2">
    <div class="footer-content">
      <p>&copy; {{ new Date().getFullYear() }} {{ config.public.appName }}</p>
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
}
</style>
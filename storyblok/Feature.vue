<template>
  <div v-editable="blok" class="feature">
    <h2>{{ blok.name }}</h2>
    <p>{{ blok.description }}</p>
  </div>
</template>

<script setup>
defineProps({ blok: Object })
</script> 
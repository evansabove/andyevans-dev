<template>
  <img :src="blok.Image.filename" :alt="blok.Image.alt" />
</template>

<script setup>
const props = defineProps({ blok: Object })
</script>

<style scoped></style>
<template>
  <div>
    <button @click="action">{{ props.blok.Text }}</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({ blok: Object })

const action = async () => {
  await navigateTo(props.blok.Link.cached_url);
}
</script>
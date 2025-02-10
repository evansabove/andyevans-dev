<template>
  <pre class="blog-code" v-html="highlightedCode"></pre>
</template>

<script setup>
import hljs from 'highlight.js/lib/core';
import csharp from 'highlight.js/lib/languages/csharp';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('csharp', csharp);

const highlightedCode = computed(() => hljs.highlight(
  props.blok.Code.code,
  { language: 'csharp' }
).value)

const props = defineProps({ blok: Object })
</script>

<style scoped>
.blog-code {
  @apply mb-10 p-5;
  @apply bg-purple-50;
  @apply overflow-scroll;
  @apply rounded-lg;
  @apply text-sm;
}
</style>
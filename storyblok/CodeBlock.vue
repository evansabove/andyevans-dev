<template>
  <div class="blog-code-container">
    <div v-if="blok.Code.title" class="blog-code-header">{{ blok.Code.title }}</div>
    <pre class="blog-code" v-html="staticCode"></pre>
  </div>
</template>

<script setup>
import hljs from 'highlight.js/lib/core';
import csharp from 'highlight.js/lib/languages/csharp';
import json from 'highlight.js/lib/languages/json';
import c from 'highlight.js/lib/languages/c';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('json', json);
hljs.registerLanguage('c', c);
hljs.registerLanguage('typescript', typescript);

const props = defineProps({ blok: Object })

const highlightCode = code => hljs.highlight(code, { language: props.blok.Code.language }).value;

const staticCode = computed(() => highlightCode(props.blok.Code.code));

</script>

<style scoped>
.blog-code-header {
  @apply italic;
}

.blog-code-container {
  @apply w-full;
  @apply flex flex-col
}

.blog-code {
  @apply mb-10 p-5 w-full;
  @apply bg-purple-50;
  @apply overflow-auto;
  @apply rounded-lg;
  @apply text-sm;
  @apply border border-solid border-purple-900;
}

.blog-code::-webkit-scrollbar {
  width: 0.2rem;
}

.blog-code::-webkit-scrollbar-thumb {
  @apply bg-purple-700;
  @apply rounded-md;
}
</style>
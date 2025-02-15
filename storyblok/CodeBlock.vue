<template>
  <div class="blog-code-container">
    <pre class="blog-code" v-if="props.blok.TypingAnimation" v-html="dynamicCode"></pre>
    <pre class="blog-code" v-else v-html="staticCode"></pre>
  </div>
</template>

<script setup>
import hljs from 'highlight.js/lib/core';
import csharp from 'highlight.js/lib/languages/csharp';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('json', json);

const props = defineProps({ blok: Object })

const highlightCode = code => hljs.highlight(code, { language: props.blok.Code.language }).value;

const staticCode = computed(() => highlightCode(props.blok.Code.code));
const dynamicCode = ref();

if (import.meta.client) {
  if (props.blok.TypingAnimation) {
    const code = props.blok.Code.code;
    const codeLength = code.length;
    let i = 0;

    const interval = setInterval(() => {
      dynamicCode.value = highlightCode(code.slice(0, i));
      i++;

      if (i > codeLength) {
        clearInterval(interval);
      }
    }, 50);
  }
}

</script>

<style scoped>
.blog-code-container {
  @apply w-full;
}

.blog-code {
  @apply mb-10 p-5;
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
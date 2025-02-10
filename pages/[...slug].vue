<script setup>
import { useStoryblokApi } from '@storyblok/vue'
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';

const storyblokApi = useStoryblokApi()

const story = ref(null)

onMounted(async () => {
    const route = window.location.pathname === '/' ? 'home' : window.location.pathname

    const response = await storyblokApi.get(`cdn/stories/${route}`, {
        version: process.env.NODE_ENV === 'production' ? 'published' : 'draft'
    })

    story.value = response.data.story
})
</script>

<template>
    <div class="app-wrapper bg-stone-100">
        <Header />

        <main class="main-content">
            <StoryblokComponent v-if="story" :blok="story.content" />
        </main>

        <Footer />
    </div>
</template>

<style scoped>
.app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}
</style>
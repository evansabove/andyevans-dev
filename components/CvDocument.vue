<template>
  <div class="cv" :class="{ 'cv--print': print }">
    <header class="cv__masthead">
      <img
        v-if="cv.biography?.image"
        :src="cv.biography.image"
        :alt="cv.biography.imageAlt ?? 'Andy Evans'"
        class="cv__photo"
        width="128"
        height="128"
        loading="eager"
        fetchpriority="high"
      >
      <div>
        <h1 class="cv__heading">Andy Evans</h1>
        <p class="cv__subtitle">{{ cv.role ?? 'Senior Software Engineer' }} · {{ cv.location ?? 'Sheffield, UK' }}</p>
        <p v-if="print && cv.availability?.location" class="cv__subtitle">{{ cv.availability.location }}</p>

        <p class="cv__contact">
          <a v-if="cv.email" :href="`mailto:${cv.email}`">{{ cv.email }}</a>
          <!-- The PDF travels without the site around it, so it carries its own links back. -->
          <template v-if="print">
            <a href="https://andyevans.dev/cv/">andyevans.dev/cv</a>
            <a href="https://www.linkedin.com/in/andy-evans-557b1125/">linkedin.com/in/andy-evans-557b1125</a>
          </template>
        </p>
        <a v-if="!print" :href="pdfPath" download="Andy-Evans-CV.pdf" class="cv__download">Download CV (PDF)</a>
      </div>
    </header>

    <CvAvailability v-if="cv.availability && !print" v-bind="cv.availability" />

    <template v-if="cv.biography?.text">
      <h2 class="cv__section">About me</h2>
      <div class="cv__bio" v-html="bioHtml" />
    </template>

    <template v-if="cv.skills?.length">
      <h2 class="cv__section">Skills</h2>
      <CvSkills :groups="cv.skills" />
    </template>

    <template v-if="cv.experience?.length">
      <h2 class="cv__section">Experience</h2>
      <template v-for="(exp, i) in cv.experience" :key="i">
        <CvCareerBreak v-if="exp.type === 'break'" v-bind="exp" />
        <CvExperience v-else v-bind="exp" />
      </template>
    </template>

    <template v-if="cv.howIWork?.length">
      <h2 class="cv__section">How I work</h2>
      <div class="cv__panel">
        <CvHowIWork
          v-for="(item, i) in cv.howIWork"
          :key="i"
          v-bind="item"
        />
      </div>
    </template>

    <template v-if="cv.education?.length">
      <h2 class="cv__section">Education</h2>
      <CvEducation
        v-for="(edu, i) in cv.education"
        :key="i"
        v-bind="edu"
      />
    </template>

    <template v-if="cv.certifications?.length">
      <h2 class="cv__section">Certifications</h2>
      <CvCertification
        v-for="(cert, i) in cv.certifications"
        :key="i"
        v-bind="cert"
      />
    </template>

    <template v-if="writing.length && !print">
      <h2 class="cv__section">Selected writing</h2>
      <div class="cv__panel">
        <p class="cv__writing-intro">
          I write up the problems I solve. These are a good way to see how I work in practice.
        </p>
        <ul class="cv__writing">
          <li v-for="post in writing" :key="post.path">
            <NuxtLink :to="post.path" class="cv__writing-link">{{ post.title }}</NuxtLink>
            <span class="cv__writing-desc">{{ post.description }}</span>
          </li>
        </ul>
        <NuxtLink to="/posts" class="cv__writing-all">Read all posts →</NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  cv: Record<string, any>
  writing: { path: string, title: string, description?: string }[]
  // Rendering the version the PDF is made from: contact details instead of a download link.
  print?: boolean
}>(), {
  print: false,
})

const pdfPath = CV_PDF_PATH

// The PDF keeps the first two paragraphs of the biography. The third says what "How I work"
// already covers, and a recruiter should reach the experience sooner.
const PRINT_BIO_PARAGRAPHS = 2
const bioHtml = computed(() => {
  const text: string = props.cv.biography?.text ?? ''
  if (!props.print) return text
  return (text.match(/<p>[\s\S]*?<\/p>/g) ?? [text]).slice(0, PRINT_BIO_PARAGRAPHS).join('')
})
</script>

<style scoped>
.cv {
  @apply max-w-3xl mx-auto;
}

.cv--print {
  max-width: none;
}

.cv__masthead {
  @apply flex items-center gap-5 mb-8;
}

.cv__photo {
  @apply rounded-full border-4 border-white shadow-md flex-shrink-0;
  width: 8rem;
  height: 8rem;
  object-fit: cover;
  object-position: top;
  /* override the global img centering and margins */
  margin: 0 !important;
}

.cv__heading {
  @apply text-3xl font-bold text-purple-900;
  margin-bottom: 0.25rem !important;
}

.cv__subtitle {
  @apply text-gray-500;
  margin-bottom: 0;
}

.cv__contact {
  @apply flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-700;
  margin-bottom: 0;
}

.cv__download {
  @apply inline-block mt-3 px-3 py-1.5 rounded-md;
  @apply border border-purple-300 text-purple-800 text-sm font-semibold no-underline;
  @apply hover:bg-purple-50 transition-colors;
}

.cv__section {
  @apply text-xl font-bold text-purple-900 mt-8 mb-4 pb-2;
  @apply border-b border-stone-200;
  font-size: 1.25rem !important;
}

.cv__panel {
  @apply border border-stone-200 rounded-lg p-5 bg-white;
}

.cv__bio {
  @apply text-gray-700 leading-relaxed;
}

.cv__bio p:last-child {
  margin-bottom: 0;
}

.cv__writing-intro {
  @apply text-gray-700;
}

.cv__writing {
  @apply list-none;
  margin: 0;
  padding: 0;

  li {
    @apply mb-3 last:mb-0;
    padding: 0;
  }
}

.cv__writing-link {
  @apply block font-semibold text-purple-900 no-underline;
}

.cv__writing-link:hover {
  @apply underline;
}

.cv__writing-desc {
  @apply block text-gray-600 text-sm mt-0.5;
}

.cv__writing-all {
  @apply inline-block mt-4 font-bold text-purple-700;
}
</style>

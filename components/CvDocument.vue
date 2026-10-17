<template>
  <div class="cv" :class="{ 'cv--print': print }">
    <header class="cv__masthead">
      <!-- UK and US recruiters advise against a photo on a CV, so it's for the website only. -->
      <img
        v-if="cv.biography?.image && !print"
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
        <p class="cv__subtitle">{{ cv.role ?? 'Senior / Lead Software Engineer' }} · {{ cv.location ?? 'Sheffield, UK' }}</p>
        <p v-if="print && cv.availability?.location" class="cv__subtitle">{{ cv.availability.location }}</p>

        <p class="cv__contact">
          <a v-if="cv.email" :href="`mailto:${cv.email}`">{{ cv.email }}</a>
          <!-- The PDF travels without the site around it, so it carries its own links back. -->
          <template v-if="print">
            <a href="https://andyevans.dev/about/">andyevans.dev/about</a>
            <a href="https://www.linkedin.com/in/andy-evans-557b1125/">linkedin.com/in/andy-evans-557b1125</a>
          </template>
        </p>
        <p v-if="!print" class="cv__downloads">
          <a
            v-for="variant in CV_VARIANTS"
            :key="variant.key"
            :href="variant.pdfPath"
            :download="variant.downloadName"
            class="cv__download"
          >{{ variant.label }} (PDF)</a>
        </p>
      </div>
    </header>

    <CvAvailability v-if="cv.availability && !print" v-bind="cv.availability" />

    <!-- The PDF gets the one-paragraph profile, so the experience starts on page 1. -->
    <template v-if="print && cv.profile">
      <h2 class="cv__section">Profile</h2>
      <p class="cv__bio">{{ cv.profile }}</p>
    </template>
    <template v-else-if="cv.biography?.text">
      <h2 class="cv__section">About me</h2>
      <div class="cv__bio" v-html="cv.biography.text" />
    </template>

    <template v-if="cv.skills?.length">
      <h2 class="cv__section">Skills</h2>
      <CvSkills :groups="cv.skills" />
    </template>

    <template v-if="cv.experience?.length">
      <h2 class="cv__section">Experience</h2>
      <template v-for="(exp, i) in roles" :key="i">
        <CvCareerBreak v-if="exp.type === 'break'" v-bind="exp" />
        <CvExperience v-else v-bind="exp" />
      </template>
    </template>

    <template v-if="earlierRoles.length">
      <h2 class="cv__section">Earlier career</h2>
      <ul class="cv__earlier">
        <li v-for="(exp, i) in earlierRoles" :key="i">
          <span class="cv__earlier-role">{{ exp.title }}, {{ exp.business }}</span>
          <span class="cv__earlier-dates">{{ formatYears(exp.start, exp.end) }}</span>
          <span class="cv__earlier-summary">{{ exp.brief ?? exp.summary }}</span>
        </li>
      </ul>
    </template>

    <template v-if="cv.howIWork?.length && !print">
      <h2 class="cv__section">How I work</h2>
      <div class="cv__panel">
        <CvHowIWork
          v-for="(item, i) in cv.howIWork"
          :key="i"
          v-bind="item"
        />
      </div>
    </template>

    <!-- One line each in the PDF: these are what pushed it onto a third page. -->
    <template v-if="print && (cv.education?.length || cv.certifications?.length)">
      <h2 class="cv__section">Education &amp; certifications</h2>
      <ul class="cv__earlier">
        <li v-for="(edu, i) in cv.education ?? []" :key="`edu-${i}`">
          <span class="cv__earlier-role">{{ edu.course }}{{ edu.grade ? ` (${edu.grade})` : '' }}, {{ edu.study_location }}</span>
          <span class="cv__earlier-dates">{{ edu.year_start }}–{{ edu.year_end }}</span>
        </li>
        <li v-for="(cert, i) in cv.certifications ?? []" :key="`cert-${i}`">
          <span class="cv__earlier-role">{{ cert.name }}</span>
          <span class="cv__earlier-dates">{{ cert.issued }}</span>
        </li>
      </ul>
    </template>

    <template v-if="cv.education?.length && !print">
      <h2 class="cv__section">Education</h2>
      <CvEducation
        v-for="(edu, i) in cv.education"
        :key="i"
        v-bind="edu"
      />
    </template>

    <template v-if="cv.certifications?.length && !print">
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

// The PDF keeps roles marked `compact` (the early-career ones) to a line each, at the end.
const roles = computed(() =>
  (props.cv.experience ?? []).filter((exp: any) => !(props.print && exp.compact)),
)
const earlierRoles = computed(() =>
  props.print ? (props.cv.experience ?? []).filter((exp: any) => exp.compact) : [],
)

function formatYears(start: string, end?: string | null) {
  const from = new Date(start).getFullYear()
  const to = end ? new Date(end).getFullYear() : 'Present'
  return from === to ? `${from}` : `${from}–${to}`
}
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
  @apply text-gray-600;
  margin-bottom: 0;
}

.cv__contact {
  @apply flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-700;
  margin-bottom: 0;
}

.cv__downloads {
  @apply flex flex-wrap gap-2 mt-3;
  margin-bottom: 0;
}

.cv__download {
  @apply inline-block px-3 py-1.5 rounded-md;
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

.cv__earlier {
  @apply list-none text-sm text-gray-700;
  margin: 0;
  padding: 0;

  li {
    @apply mb-2 last:mb-0;
    padding: 0;
  }
}

.cv__earlier-role {
  @apply font-semibold text-purple-900;
}

.cv__earlier-dates {
  @apply text-gray-700 ms-2;
}

.cv__earlier-summary {
  @apply block;
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

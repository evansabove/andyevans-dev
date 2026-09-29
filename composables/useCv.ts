// Posts outside these tags are the ones that evidence the skills on the CV.
const NON_TECHNICAL_TAGS = ['Automotive']

/**
 * The CV content and the writing that backs it up, shared by /cv and the print version
 * the PDF is rendered from, so the two can't drift apart.
 */
export async function useCv() {
  // Both calls start before anything is awaited. Nuxt loses its instance after the first
  // `await` in a composable, so a second useAsyncData after one fails with
  // "[nuxt] instance unavailable" during prerender.
  const [{ data: cvData }, { data: writing }] = await Promise.all([
    useAsyncData('cv-page', async () => {
      const result = await queryCollection('pages').where('stem', '=', 'pages/cv').first()
      return result ?? {}
    }),
    useAsyncData('cv-writing', () => {
      const query = queryCollection('posts').order('date', 'DESC')
      if (!import.meta.dev) query.where('draft', '<>', true)
      return query.all()
    }),
  ])

  // Nuxt Content puts unschema'd fields from a data collection under `meta`. Fall back to the
  // top level so a change to the collection schema can't silently blank the page.
  const cv = computed<Record<string, any>>(() => (cvData.value as any)?.meta ?? (cvData.value as any) ?? {})

  const selectedWriting = computed(() =>
    (writing.value ?? [])
      .filter(post => !(post.tags ?? []).some((tag: string) => NON_TECHNICAL_TAGS.includes(tag)))
      .slice(0, 4),
  )

  return { cv, selectedWriting }
}

/** Where the generated PDF is served from. Written by scripts/generate-cv-pdf.mjs. */
export const CV_PDF_PATH = '/andy-evans-cv.pdf'

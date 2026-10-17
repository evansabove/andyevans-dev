// Posts outside these tags are the ones that evidence the skills on the CV.
const NON_TECHNICAL_TAGS = ['Automotive']

/**
 * The downloadable CVs. Each one is cv.yml with that variant's overrides from `variants` applied,
 * rendered from its print page to its PDF by scripts/generate-cv-pdf.mjs, which keeps its own copy
 * of these paths. The first is the plain cv.yml, which /about shows.
 */
export const CV_VARIANTS = [
  {
    key: 'software',
    label: 'Software engineering CV',
    printPath: '/about/print/',
    pdfPath: '/andy-evans-cv.pdf',
    downloadName: 'Andy-Evans-CV-Software.pdf',
  },
  {
    key: 'platform',
    label: 'DevOps & platform CV',
    printPath: '/about/print/platform/',
    pdfPath: '/andy-evans-cv-platform.pdf',
    downloadName: 'Andy-Evans-CV-DevOps-Platform.pdf',
  },
] as const

export type CvVariantKey = typeof CV_VARIANTS[number]['key']

/**
 * The CV content and the writing that backs it up, shared by /about and the print versions
 * the PDFs are rendered from, so they can't drift apart.
 */
export async function useCv(variant: CvVariantKey = 'software') {
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
  const cv = computed<Record<string, any>>(() =>
    applyVariant((cvData.value as any)?.meta ?? (cvData.value as any) ?? {}, variant),
  )

  const selectedWriting = computed(() =>
    (writing.value ?? [])
      .filter(post => !(post.tags ?? []).some((tag: string) => NON_TECHNICAL_TAGS.includes(tag)))
      .slice(0, 4),
  )

  return { cv, selectedWriting }
}

/**
 * Overlay a variant from cv.yml's `variants` onto the base CV. Top-level fields are replaced
 * whole. `experience` is a map from a role's `id` to the fields that change for that role, so a
 * variant can re-pitch a role without restating the whole timeline.
 */
function applyVariant(base: Record<string, any>, variant: CvVariantKey): Record<string, any> {
  const { variants, ...cv } = base
  const overrides = variants?.[variant]
  if (!overrides) return cv

  const { experience: roleOverrides = {}, ...fields } = overrides
  return {
    ...cv,
    ...fields,
    experience: (cv.experience ?? []).map((role: any) =>
      role.id && roleOverrides[role.id] ? { ...role, ...roleOverrides[role.id] } : role,
    ),
  }
}

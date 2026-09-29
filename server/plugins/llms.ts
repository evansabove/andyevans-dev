import { queryCollection } from '@nuxt/content/server'

/**
 * Add the CV to the generated llms.txt and llms-full.txt.
 *
 * @nuxt/content contributes the blog posts on its own, but the CV lives in a data collection
 * (`content/pages/cv.yml`) rather than as a page, so it needs adding by hand. Reading it from
 * the collection rather than restating it here keeps the two from drifting apart.
 *
 * Note: nuxt-llms@0.2.0 renders `notes` from the original runtime config while handing hooks a
 * clone, so notes added here never reach the output. Section descriptions are free text and do
 * render, so the CV summary goes there instead.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('llms:generate', async (event, options) => {
    const cv = await loadCv(event)
    if (!cv) return

    options.sections = options.sections ?? []
    options.sections.unshift({
      title: 'CV',
      description: summariseCv(cv),
      links: [
        {
          title: cv.title ?? 'CV',
          description: cv.description ?? '',
          href: `${options.domain}/cv/`,
        },
        {
          title: 'CV (PDF)',
          description: 'The same CV as a downloadable PDF.',
          href: `${options.domain}/andy-evans-cv.pdf`,
        },
      ],
    })
  })

  nitroApp.hooks.hook('llms:generate:full', async (event, _options, contents) => {
    const cv = await loadCv(event)
    if (!cv) return
    contents.unshift(renderCvMarkdown(cv))
  })
})

async function loadCv(event: any): Promise<Record<string, any> | null> {
  const doc = await queryCollection(event, 'pages').where('stem', '=', 'pages/cv').first()
  const data: Record<string, any> = (doc as any)?.meta ?? doc ?? {}
  return Object.keys(data).length ? data : null
}

/** Compact prose for the llms.txt section description. */
function summariseCv(cv: Record<string, any>): string {
  const lines: string[] = []
  const current = (cv.experience ?? []).find((role: any) => !role.end && role.type !== 'break')

  if (cv.description) lines.push(cv.description)
  if (current) lines.push(`Currently ${current.title} at ${current.business}, ${current.location}.`)

  const availability = cv.availability
  if (availability) {
    const roles = (availability.roles ?? []).join('; ')
    lines.push(
      [
        `${availability.status}.`,
        availability.text,
        roles && `Open to: ${roles}.`,
        (availability.industries ?? []).length && `Industries of interest: ${availability.industries.join('; ')}.`,
        availability.location && `Location: ${availability.location}.`,
        availability.contactUrl && `Contact: ${availability.contactUrl}`,
      ].filter(Boolean).join(' '),
    )
  }

  for (const group of cv.skills ?? []) {
    lines.push(`${group.category}: ${(group.items ?? []).join(', ')}`)
  }

  return lines.join('\n\n')
}

/** The whole CV as markdown, for llms-full.txt. */
function renderCvMarkdown(cv: Record<string, any>): string {
  const out: string[] = [`# ${cv.title ?? 'CV'}`]

  if (cv.description) out.push(cv.description)

  if (cv.biography?.text) {
    out.push('## About', stripHtml(cv.biography.text))
  }

  const availability = cv.availability
  if (availability) {
    out.push(
      '## What I am looking for',
      [
        `Status: ${availability.status}`,
        availability.text,
        (availability.roles ?? []).length ? `Roles: ${availability.roles.join('; ')}` : '',
        (availability.industries ?? []).length ? `Industries of interest: ${availability.industries.join('; ')}` : '',
        availability.location ? `Location: ${availability.location}` : '',
        availability.contactUrl ? `Contact: ${availability.contactUrl}` : '',
      ].filter(Boolean).join('\n'),
    )
  }

  if ((cv.skills ?? []).length) {
    out.push(
      '## Skills',
      cv.skills.map((g: any) => `- ${g.category}: ${(g.items ?? []).join(', ')}`).join('\n'),
    )
  }

  if ((cv.experience ?? []).length) {
    out.push('## Experience')
    for (const role of cv.experience) {
      const end = role.end ? formatMonth(role.end) : 'Present'
      const parts = [
        `### ${role.business ? `${role.title}, ${role.business}` : role.title}`,
        `${formatMonth(role.start)} to ${end}${role.location ? ` — ${role.location}` : ''}`,
      ]
      if (role.summary) parts.push(role.summary)
      if ((role.highlights ?? []).length) {
        parts.push(role.highlights.map((h: string) => `- ${h}`).join('\n'))
      }
      if ((role.links ?? []).length) {
        parts.push(role.links.map((l: any) => `${l.label}: ${l.url}`).join('\n'))
      }
      if ((role.tags ?? []).length) parts.push(`Technologies: ${role.tags.join(', ')}`)
      out.push(parts.join('\n\n'))
    }
  }

  if ((cv.education ?? []).length) {
    out.push(
      '## Education',
      cv.education
        .map((e: any) => `- ${e.course}, ${e.study_location}, ${e.year_start}–${e.year_end}${e.grade ? ` (${e.grade})` : ''}`)
        .join('\n'),
    )
  }

  if ((cv.certifications ?? []).length) {
    out.push(
      '## Certifications',
      cv.certifications.map((c: any) => `- ${c.name}, ${c.issuer}, issued ${c.issued}`).join('\n'),
    )
  }

  return out.join('\n\n')
}

function stripHtml(html: string): string {
  return html
    .replace(/<\/p>\s*<p>/g, '\n\n')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function formatMonth(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
}

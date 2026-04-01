import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
        dateModified: z.string().optional(),
      })
    }),
    pages: defineCollection({
      type: 'data',
      source: 'pages/**/*.yml',
    })
  }
})

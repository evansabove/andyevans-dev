---
title: "How this website works"
description: "I made some improvements to how this website works. Read about how this actual site is put together and deployed"
date: 2026-03-28
tags: ["Architecture", "Hosting", "Nuxt"]
image: /images/posts/how-this-website-works/header.png
imageAlt: "Abstract illustration of a fast simple hosting setup"
---

For a long time I relied on Storyblok to manage the content for this site. I'd used it for a few projects in the past - and rolled with it for this site too. Storyblok itself offers a free tier for freelancers and small businesses - but I really wanted to get away from 3rd party dependencies if I didn't absolutely need them. 

Also - with what I'm showing you here today - I can leverage AI tooling to make maintaining and building this site easier.

## The Stack

I built the site using Nuxt 3 and Vue - again from previous experience of this technology. It's a great framework that gives me the flexibility I need without feeling bloated. I used TailwindCSS to handle the styling elegantly.

But the real game-changer here is Nuxt Content. Instead of relying on an external CMS (Storyblok), all of my blog posts now live right in the <a href="https://github.com/evansabove/andyevans-dev" target="_blank" rel="noopener noreferrer">repository</a> alongside the code as Markdown files.

```text
content/
  posts/
    how-this-website-works.md
    other-blog-post-1.md
    other-blog-post-2.md
    other-blog-post-3.md
public/
  images/
components/
pages/
```

Each post is a Markdown file with a block of [YAML frontmatter](https://content.nuxt.com/usage/markdown#front-matter) at the top describing what the post is, when it was published, and what tags it has:

```yaml
---
title: "How this website works"
description: "I am finally happy with a low-dependency hosting setup for this site."
date: 2026-03-28
tags: ["Architecture", "Hosting", "Nuxt"]
---

The rest of the post goes here...
```

Nuxt Content handles the parsing, and even gives me type-safety over that metadata using Zod schemas:

```ts
export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        tags: z.array(z.string()).optional()
      })
    })
  }
})
```

This also means I don't need to configure any web hooks from Storyblok or worry about expiring access tokens: just write a file, commit it, done.

## Markdown to HTML

Nuxt Content uses its own Markdown renderer called <a href="https://content.nuxt.com/docs/files/markdown" target="_blank" rel="noopener noreferrer">MDC</a> to convert the Markdown files into HTML at build time. It handles the standard stuff (headings, lists, bold, links) but also adds support for Vue components embedded directly in Markdown, which is a nice trick for more interactive posts.

Code blocks get an extra pass through <a href="https://highlightjs.org/" target="_blank" rel="noopener noreferrer">highlight.js</a> to apply syntax highlighting. I have it configured to support a bunch of languages out of the box:

```ts [nuxt.config.ts]
mdc: {
  highlight: {
    theme: 'github-light',
    langs: ['js', 'ts', 'vue', 'html', 'css', 'json', 'bash', 'csharp', 'yaml', 'sql']
  }
}
```


## Deployment

This should be easy: it's just static website hosting. A single command produces a chunk of completely static HTML, CSS, and JS ready to be served from anywhere:

```bash
npm run build
```

I chose Cloudflare Pages for the job. It connects directly to my GitHub repository. Every time I push a commit to the `main` branch, Cloudflare builds and deploys my site to its global networks.

Cloudflare handles the TLS certificates, the caching, and the continuous deployment pipeline without me having to give it a second thought. It is free, fast, and super reliable.

No bells and whistles, just static content delivered to the browser!
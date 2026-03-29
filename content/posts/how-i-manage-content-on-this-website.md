---
title: "How I manage content on this website"
description: "Learn how this blog site is put together - with minimal dependencies and bloat"
date: 2026-03-28
tags: ["Architecture", "Hosting", "Nuxt", "Content Management"]
image: /images/posts/how-i-manage-content-on-this-website/header.png
imageAlt: "Abstract illustration of a fast simple hosting setup"
---

When I first developed this site, I used <a href="https://www.storyblok.com/" target="_blank" rel="noopener noreferrer">Storyblok</a> to manage the content. I'd used it for a few projects in the past - and rolled with it for this site too. Storyblok is a great platform, offering a very intuitive user interface and tools for non-technical users. It offers a free tier for freelancers and small businesses - so nothing to pay - but I really wanted to get away from 3rd party dependencies if I didn't absolutely need them.

Another reason to move away from Storyblok and towards an 'in-repo' model as I'm about to show you, is AI tooling. If my content is in the git repository, then I can make better use of AI tooling for review, generation and improvement of my posts. Cool!

## The Stack

The site is built using Vue and Nuxt 3, again from previous experience of this technology. Using Vue/Nuxt means I can take advantage of a very mature framework to easily generate the frame of the website, generate a static website and host it - no server-side rendering or large single-page apps to be delivered to the browser.

Nuxt also offers us a nice plugin for embedding content: <a href="https://content.nuxt.com/">Nuxt Content</a>. Instead of relying on the Storyblok CMS, all of my blog posts now live right in the <a href="https://github.com/evansabove/andyevans-dev" target="_blank" rel="noopener noreferrer">repository</a> alongside the code as Markdown files - in the following structure:

```text
content/
  posts/
    how-i-manage-content-on-this-website.md
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
title: "How I manage content on this website"
description: "Learn how this blog site is put together - with minimal dependencies and bloat."
date: 2026-03-28
tags: ["Architecture", "Hosting", "Nuxt"]
---

The rest of the post goes here in markdown...
```

A <a href="https://zod.dev/">Zod schema</a> in `content.config.ts` even gives me type-safety over that metadata:

```ts [content.config.ts]
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

This also means I don't need to configure any web hooks from Storyblok or worry about expiring access tokens - for each new post, I just write a markdown file, commit it, and I'm done.

One downside of this of course is that I can no longer take advantage of Storyblok's user interface. In theory, I could write and publish a new blog post from my phone on the go - from the beach, from the side of a mountain - but I never really did that anyway, and almost all of the time I'm sat at a laptop doing it, and so I can just use at minimum a text editor, a git client and an internet connection. I also don't have anyone else maintaining this website, so it's just me and I can design it around the tooling I'm happy with. 

This approach isn't for everyone and every situation, but it does work for me!

## Markdown to HTML

Nuxt Content uses its own Markdown renderer called <a href="https://content.nuxt.com/docs/files/markdown" target="_blank" rel="noopener noreferrer">MDC</a> to convert the Markdown files into HTML at build time. It handles the standard stuff (headings, lists, bold, links) but also adds support for Vue components embedded directly in Markdown, which is helpful for richer content.

## Deployment

This should be easy: and it is! It's just static website hosting. A single command produces a chunk of completely static HTML, CSS, and JS ready to be served from anywhere:

```bash
npm run build
```

For the hosting, I chose Cloudflare Pages. I already had my domain managed by Cloudflare, and Pages connects directly to my GitHub repository - every time I push a commit to the `main` branch, Cloudflare builds and deploys my site to its global networks, serving my site from `andyevans.dev`. Cloudflare Pages has a free tier - so there's no cost here either!

Cloudflare handles the TLS certificates, the caching, and the continuous deployment pipeline without me having to give it a second thought. It is free, fast, and super reliable.

No bells and whistles, just static content delivered to the browser - and not a penny to pay in hosting or CMS.
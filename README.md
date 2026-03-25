# andyevans.dev

Personal website and blog for Andy Evans, software engineer based in Sheffield, UK.

## About

This site is built with [Nuxt](https://nuxt.com/) and [Nuxt Content](https://content.nuxt.com/), using Markdown files for blog posts. It is statically generated and deployed via Cloudflare Pages.



## Writing a Blog Post

Blog posts live in `content/posts/` as `.md` files. Each post requires the following frontmatter:

```yaml
---
title: "Post title"
description: "One-sentence description shown in post listings."
date: YYYY-MM-DD
tags: ["Tag1", "Tag2"]
image: /images/posts/<slug>/header.png   # optional
imageAlt: ""
---
```

Post images should be placed in `public/images/posts/<slug>/`.

## Development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

## Build

```bash
npm run build
```

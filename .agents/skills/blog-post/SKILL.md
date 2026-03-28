---
name: blog-post
description: Write a new blog post for andyevans.dev in Andy's writing style
---

# Writing a Blog Post for andyevans.dev

## Site structure

- Blog posts live in `content/posts/` as `.md` files
- Filename should be a URL-friendly slug of the title, e.g. `my-post-title.md`
- Existing posts are the ground truth for format and style. Always read 1-2 before writing.
- All external links must open in a new tab. Use raw HTML instead of markdown link syntax: `<a href="https://..." target="_blank" rel="noopener noreferrer">link text</a>`

## Frontmatter format

```yaml
---
title: "Post title here"
description: "One-sentence hook for the post."
date: YYYY-MM-DD
tags: ["Tag1", "Tag2"]
image: /images/posts/<slug>/<image-file>   # optional, omit if no image
imageAlt: ""
---
```

## Andy's writing style - critical rules

Read at least one existing post before writing. Key characteristics:

1. **First-person, direct, conversational**: write like you're telling a colleague the story over coffee
2. **Story-first, not tutorial-first**: lead with *why* and *what happened*, not a step-by-step guide
3. **Show-boating is fine**: the point is often to demonstrate something clever; don't hide that
4. **Code is supporting evidence, not the centrepiece**: include short, illustrative snippets only; not every function needs to be shown
5. **Short sentences. Short paragraphs.** No waffle
6. **Never use em dashes (—)**. They are a tell-tale sign of AI-generated content. Use a regular hyphen, a comma, or rewrite the sentence instead
7. **Personality**: dry wit, genuine enthusiasm when something worked, honest about the hard bits
8. **Punchy ending**: a single memorable line works better than a summary wrap-up
9. **No self-referential links** in the post body. Social/contact links appear elsewhere on the site

## Workflow

1. Ask the user for the post topic and context if not provided
2. Read 1–2 existing posts (`content/posts/*.md`) to calibrate voice
3. Propose a rough outline (intro hook, 2–4 sections, closing line) and agree it with the user
4. Ask for any code, screenshots or raw material the user wants to include
5. Write the post — lean and punchy, not exhaustive
6. Always generate a header image (use `generate_image` tool). Place it in `public/images/posts/<slug>/` and reference it in frontmatter.
7. After placing the image, run `npm run thumbnails` from the project root to auto-generate a thumbnail (`header-thumb.webp`). This is mandatory for every post.

## Images

- If the post has a header image, it should be placed in `public/images/posts/<slug>/`
- Reference it in frontmatter as `/images/posts/<slug>/<filename>`
- After placing the image, always run `npm run thumbnails` to generate a `<name>-thumb.webp` thumbnail alongside it
- Use `<figure>` + `<figcaption>` tags for inline images within the post body

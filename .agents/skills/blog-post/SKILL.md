---
name: blog-post
description: Scaffold a new blog post for andyevans.dev — structure only, Andy writes the prose
---

# Scaffolding a Blog Post for andyevans.dev

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

**Do not write the post content.** Andy writes the prose himself. Your job is to set up the structure so he can start writing immediately.

1. Create a new git branch named `blog/<slug>`
2. Create the `.md` file in `content/posts/` with complete frontmatter (fill in title, description placeholder, date, and suggested tags)
3. Add section headings only — no body text under any heading, just `<!-- TODO -->` comments as placeholders
4. Generate a header image (use `generate_image` tool). Place it in `public/images/posts/<slug>/` and reference it in frontmatter.
5. Run `npm run thumbnails` from the project root to auto-generate a thumbnail. This is mandatory.
6. Tell the user the file is ready and list the section headings you've suggested, inviting them to change any.

## Scaffold format

The body of the scaffolded post should look like this — headings only, no prose:

```markdown
## Section one heading

<!-- TODO -->

## Section two heading

<!-- TODO -->

## Section three heading

<!-- TODO -->
```

Choose 3–5 headings that follow a logical story arc based on the topic. Make them specific and useful, not generic (avoid "Introduction", "Conclusion", "Summary" etc.).

## Images

- If the post has a header image, it should be placed in `public/images/posts/<slug>/`
- Reference it in frontmatter as `/images/posts/<slug>/<filename>`
- After placing the image, always run `npm run thumbnails` to generate a `<name>-thumb.webp` thumbnail alongside it
- Use `<figure>` + `<figcaption>` tags for inline images within the post body

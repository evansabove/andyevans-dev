/**
 * Turn a tag into a URL-safe slug.
 *
 * A plain lowercase-and-hyphenate leaves characters like `#` in the path, so "C#" produced
 * `/topics/c#` — the browser reads the `#` as a fragment and the topic page is unreachable.
 * Spell those characters out instead.
 */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/#/g, 'sharp')
    .replace(/\+/g, 'plus')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

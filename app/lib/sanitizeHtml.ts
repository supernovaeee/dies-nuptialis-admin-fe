import DOMPurify from 'dompurify'

// Allowlist matches the tags/attrs BlockNote's blocksToHTMLLossy() emits —
// keep in sync with Amity's app/src/lib/sanitizeHtml.ts (public site renderer).
const ALLOWED_TAGS = [
  'p', 'br',
  'strong', 'b', 'em', 'i', 'u', 's', 'code',
  'h1', 'h2', 'h3',
  'ul', 'ol', 'li',
  'blockquote', 'pre',
  'a',
  'figure', 'figcaption', 'img',
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'width', 'height']

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}

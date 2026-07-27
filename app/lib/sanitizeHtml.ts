import DOMPurify from 'dompurify'

// Allowlist matches the tags/attrs BlockNote's blocksToHTMLLossy() emits, plus
// the `div` wrapper RichTextEditor adds to carry image alignment (see
// applyImageAlignment in components/ui/RichTextEditor.tsx) —
// keep in sync with Amity's app/src/lib/sanitizeHtml.ts (public site renderer).
const ALLOWED_TAGS = [
  'p', 'br',
  'strong', 'b', 'em', 'i', 'u', 's', 'code',
  'h1', 'h2', 'h3',
  'ul', 'ol', 'li',
  'blockquote', 'pre',
  'a',
  'figure', 'figcaption', 'img',
  'div',
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'style']

// `style` is only ever used for image alignment (text-align: left|center|right|
// justify). Lock the value down to that exact shape so allowing the attribute
// doesn't open a general CSS-injection vector.
DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  if (data.attrName !== 'style') return
  const match = /^text-align:\s*(left|center|right|justify)\s*;?$/.exec(data.attrValue.trim())
  data.attrValue = match ? `text-align: ${match[1]}` : ''
})

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}

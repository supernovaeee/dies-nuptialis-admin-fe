// Plain-text preview of rich content for list rows — not used with
// dangerouslySetInnerHTML, so a regex strip is sufficient here.
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

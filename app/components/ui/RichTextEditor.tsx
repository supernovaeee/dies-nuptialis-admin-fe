import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import type { Block, PartialBlock } from '@blocknote/core'
import { AxiosClient } from '@api/AxiosClient'
import { AUTH_HEADER } from '~/lib/authHeader'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// Maps BlockNote's textAlignment values to a flexbox justify-content value.
// A flex wrapper is used (rather than `text-align`) because Tailwind's
// preflight reset sets `img { display: block }` — text-align only centers
// inline content, so it's a no-op against a block-level <img>. justify-content
// centers a block-level flex item just fine.
const JUSTIFY_BY_ALIGNMENT: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  justify: 'flex-start',
}
const ALIGNMENT_BY_JUSTIFY: Record<string, string> = {
  'flex-start': 'left',
  center: 'center',
  'flex-end': 'right',
}

// BlockNote's built-in image block tracks a `textAlignment` prop (set via the
// block toolbar), but its `toExternalHTML` implementation — unlike paragraph,
// heading, quote, and list-item blocks — never writes that alignment onto the
// serialized element. blocksToHTMLLossy() silently drops it, so every saved
// image renders left-aligned regardless of what was picked in the editor.
// Work around the upstream gap by re-applying alignment as a wrapper div
// after serialization, matching images back to their block by `src` url.
function applyImageAlignment(html: string, blocks: Block[]): string {
  const alignmentByUrl = new Map<string, string>()
  const collectImageAlignments = (list: Block[]) => {
    for (const block of list) {
      if (
        block.type === 'image' &&
        typeof block.props.url === 'string' &&
        block.props.url &&
        typeof block.props.textAlignment === 'string' &&
        block.props.textAlignment !== 'left'
      ) {
        alignmentByUrl.set(block.props.url, block.props.textAlignment)
      }
      if (block.children.length > 0) collectImageAlignments(block.children)
    }
  }
  collectImageAlignments(blocks)
  if (alignmentByUrl.size === 0) return html

  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('img').forEach((img) => {
    const align = alignmentByUrl.get(img.getAttribute('src') ?? '')
    if (!align) return
    const target = img.closest('figure') ?? img
    const wrapper = doc.createElement('div')
    wrapper.setAttribute(
      'style',
      `display: flex; justify-content: ${JUSTIFY_BY_ALIGNMENT[align] ?? 'flex-start'};`,
    )
    target.replaceWith(wrapper)
    wrapper.appendChild(target)
  })
  return doc.body.innerHTML
}

// Mirror image of applyImageAlignment, for the load path: BlockNote's image
// block parser (imageParse in @blocknote/core) reads backgroundColor off a
// parsed <img>/<figure> but never textAlignment, so re-opening saved HTML
// would otherwise reset every aligned image back to "left" in the editor.
// Recover the alignment from our flex wrapper div (keyed by `src`) and patch
// it onto the parsed blocks before seeding.
function extractImageAlignments(html: string): Map<string, string> {
  const alignmentByUrl = new Map<string, string>()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('div[style*="justify-content"]').forEach((div) => {
    if (!(div instanceof HTMLElement)) return
    const align = ALIGNMENT_BY_JUSTIFY[div.style.justifyContent]
    const src = div.querySelector('img')?.getAttribute('src')
    if (align && src) alignmentByUrl.set(src, align)
  })
  return alignmentByUrl
}

function restoreImageAlignment(
  blocks: Block[],
  alignmentByUrl: Map<string, string>,
): PartialBlock[] {
  if (alignmentByUrl.size === 0) return blocks
  return blocks.map((block) => {
    const children =
      block.children.length > 0 ? restoreImageAlignment(block.children, alignmentByUrl) : block.children
    if (block.type === 'image' && typeof block.props.url === 'string') {
      const align = alignmentByUrl.get(block.props.url)
      if (align) {
        return {
          ...block,
          children,
          props: { ...block.props, textAlignment: align as typeof block.props.textAlignment },
        }
      }
    }
    return { ...block, children }
  })
}

interface RichTextEditorProps {
  initialContent: string
  onChange: (html: string) => void
}

// Images are inserted as blocks in the flow (slash menu, drag-drop, or
// paste) — there is no separate "attach an image" control. Every upload
// goes through the same /admin/upload/image endpoint as the card cover
// photo, so it lands in the same MinIO `carousel/` prefix.
export function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const initialContentRef = useRef(initialContent)
  const hasSeededRef = useRef(false)

  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      const data = await fileToBase64(file)
      const res = await AxiosClient.adminUploadImage({
        headers: AUTH_HEADER,
        body: { data },
      })
      return res.url
    },
  })

  useEffect(() => {
    if (hasSeededRef.current) return
    hasSeededRef.current = true
    const html = initialContentRef.current
    if (!html) return
    const blocks = editor.tryParseHTMLToBlocks(html)
    const alignedBlocks = restoreImageAlignment(blocks, extractImageAlignments(html))
    editor.replaceBlocks(editor.document, alignedBlocks)
    // Seed once on mount only — this editor instance is not reused across cards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="overflow-hidden rounded border border-stone-300 focus-within:border-stone-500 focus-within:ring-1 focus-within:ring-stone-500">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={(ed) =>
          onChange(applyImageAlignment(ed.blocksToHTMLLossy(ed.document), ed.document))
        }
      />
    </div>
  )
}

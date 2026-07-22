import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
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
    editor.replaceBlocks(editor.document, blocks)
    // Seed once on mount only — this editor instance is not reused across cards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="overflow-hidden rounded border border-stone-300 focus-within:border-stone-500 focus-within:ring-1 focus-within:ring-stone-500">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={(ed) => onChange(ed.blocksToHTMLLossy(ed.document))}
      />
    </div>
  )
}

import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react'
import { Modal } from './Modal'

// The Q&A carousel card on the invitation site (Amity FE, QandASection.tsx /
// amity.scss `.am-flip-card`) renders the uploaded photo full-bleed behind a
// `aspect-ratio: 3 / 4` card with `object-fit: cover`. Cropping to that same
// ratio here means the admin sees exactly what will be visible on the card
// instead of finding out after the fact that the top of someone's head got
// cut off by object-fit: cover.
const ASPECT_RATIO = 3 / 4
const FRAME_WIDTH = 220
const FRAME_HEIGHT = Math.round(FRAME_WIDTH / ASPECT_RATIO)
const OUTPUT_WIDTH = 900
const OUTPUT_HEIGHT = Math.round(OUTPUT_WIDTH / ASPECT_RATIO)
const MIN_ZOOM = 1
const MAX_ZOOM = 3

interface Offset {
  x: number
  y: number
}

interface NaturalSize {
  w: number
  h: number
}

function clampOffset(offset: Offset, dispW: number, dispH: number): Offset {
  const minX = Math.min(0, FRAME_WIDTH - dispW)
  const minY = Math.min(0, FRAME_HEIGHT - dispH)
  return {
    x: Math.min(0, Math.max(minX, offset.x)),
    y: Math.min(0, Math.max(minY, offset.y)),
  }
}

interface ImageCropperProps {
  open: boolean
  imageSrc: string | null
  loading?: boolean
  onCancel: () => void
  onConfirm: (base64: string) => void
}

export function ImageCropper({
  open,
  imageSrc,
  loading = false,
  onCancel,
  onConfirm,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const dragStart = useRef<{ x: number; y: number; offset: Offset } | null>(null)

  const [naturalSize, setNaturalSize] = useState<NaturalSize | null>(null)
  const [baseScale, setBaseScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })

  // Reset crop state whenever a new image comes in.
  useEffect(() => {
    setNaturalSize(null)
    setBaseScale(1)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }, [imageSrc])

  function handleImageLoad() {
    const img = imgRef.current
    if (!img) return
    const w = img.naturalWidth
    const h = img.naturalHeight
    const scale = Math.max(FRAME_WIDTH / w, FRAME_HEIGHT / h)
    setNaturalSize({ w, h })
    setBaseScale(scale)
    setZoom(1)
    setOffset({
      x: (FRAME_WIDTH - w * scale) / 2,
      y: (FRAME_HEIGHT - h * scale) / 2,
    })
  }

  function applyZoom(nextZoom: number) {
    if (!naturalSize) return
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom))
    const oldScale = baseScale * zoom
    const newScale = baseScale * clampedZoom

    // Zoom around the frame's center so the subject doesn't jump.
    const centerX = FRAME_WIDTH / 2
    const centerY = FRAME_HEIGHT / 2
    const natX = (centerX - offset.x) / oldScale
    const natY = (centerY - offset.y) / oldScale

    const dispW = naturalSize.w * newScale
    const dispH = naturalSize.h * newScale
    const nextOffset = clampOffset(
      { x: centerX - natX * newScale, y: centerY - natY * newScale },
      dispW,
      dispH,
    )

    setZoom(clampedZoom)
    setOffset(nextOffset)
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!naturalSize) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX, y: e.clientY, offset }
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragStart.current || !naturalSize) return
    const scale = baseScale * zoom
    const dispW = naturalSize.w * scale
    const dispH = naturalSize.h * scale
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setOffset(
      clampOffset(
        { x: dragStart.current.offset.x + dx, y: dragStart.current.offset.y + dy },
        dispW,
        dispH,
      ),
    )
  }

  function handlePointerUp() {
    dragStart.current = null
  }

  function handleWheel(e: WheelEvent<HTMLDivElement>) {
    if (!naturalSize) return
    e.preventDefault()
    applyZoom(zoom - e.deltaY * 0.001)
  }

  function handleConfirm() {
    if (!naturalSize || !imgRef.current) return
    const scale = baseScale * zoom
    const sx = -offset.x / scale
    const sy = -offset.y / scale
    const sw = FRAME_WIDTH / scale
    const sh = FRAME_HEIGHT / scale

    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_WIDTH
    canvas.height = OUTPUT_HEIGHT
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)

    const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1]
    onConfirm(base64)
  }

  return (
    <Modal open={open} onClose={onCancel} title="Crop Image">
      <div className="flex flex-col items-center">
        <div
          className="relative touch-none overflow-hidden rounded border border-stone-300 bg-stone-100"
          style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT, cursor: naturalSize ? 'grab' : 'default' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt=""
              draggable={false}
              onLoad={handleImageLoad}
              className="absolute max-w-none select-none"
              style={{
                left: offset.x,
                top: offset.y,
                width: naturalSize ? naturalSize.w * baseScale * zoom : undefined,
                height: naturalSize ? naturalSize.h * baseScale * zoom : undefined,
                visibility: naturalSize ? 'visible' : 'hidden',
              }}
            />
          )}
        </div>

        <div className="mt-3 flex w-full items-center gap-2">
          <span className="text-xs text-stone-500">Zoom</span>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => applyZoom(Number(e.target.value))}
            disabled={!naturalSize}
            className="flex-1 accent-stone-900"
            aria-label="Zoom"
          />
        </div>

        <p className="mt-2 text-xs text-stone-500">
          Drag to reposition. Cropped to 3:4 to match how it appears on the carousel card.
        </p>

        <div className="mt-4 flex w-full justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!naturalSize || loading}
            className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Use Photo'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

import { useState, type FormEvent } from 'react'
import { useCarouselCards } from '~/hooks/useCarouselCards'
import { useCreateCarouselCard } from '~/hooks/useCreateCarouselCard'
import { useUpdateCarouselCard } from '~/hooks/useUpdateCarouselCard'
import { useDeleteCarouselCard } from '~/hooks/useDeleteCarouselCard'
import { useReorderCarouselCards } from '~/hooks/useReorderCarouselCards'
import { useUploadImage } from '~/hooks/useUploadImage'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { Modal } from '~/components/ui/Modal'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { EmptyState } from '~/components/ui/EmptyState'
import type { CarouselCardItem } from '@api/schema/CarouselCardItem'

export default function CarouselPage() {
  const toast = useToast()
  const { data, isLoading, error } = useCarouselCards()
  const reorder = useReorderCarouselCards()

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<CarouselCardItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CarouselCardItem | null>(
    null,
  )
  const deleteCard = useDeleteCarouselCard()

  const cards = data?.data
    ? [...data.data].sort((a, b) => a.sort_order - b.sort_order)
    : []

  function handleMove(cardId: number, direction: 'up' | 'down') {
    const idx = cards.findIndex((c) => c.id === cardId)
    if (idx < 0) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= cards.length) return

    const newOrder = cards.map((c) => c.id)
    ;[newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]]

    reorder.mutate(newOrder, {
      onError: (err) =>
        toast.error(getApiErrorMessage(err, 'Failed to reorder')),
    })
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteCard.mutate(String(deleteTarget.id), {
      onSuccess: () => {
        toast.success('Card deleted')
        setDeleteTarget(null)
      },
      onError: (err) =>
        toast.error(getApiErrorMessage(err, 'Failed to delete card')),
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-stone-900">Carousel Cards</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add Card
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load carousel cards.
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      )}

      {data && cards.length === 0 && (
        <EmptyState
          title="No carousel cards yet"
          description="Add a card to display on the invitation site."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              Add Card
            </button>
          }
        />
      )}

      {cards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden"
            >
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={card.title ?? ''}
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center bg-stone-100 text-sm text-stone-400">
                  No image
                </div>
              )}

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-medium text-stone-900">
                  {card.title || 'Untitled'}
                </h3>
                {card.content && (
                  <p className="mt-1 flex-1 text-xs text-stone-500 line-clamp-2">
                    {card.content}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMove(card.id, 'up')}
                      disabled={idx === 0 || reorder.isPending}
                      className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMove(card.id, 'down')}
                      disabled={idx === cards.length - 1 || reorder.isPending}
                      className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M10.53 13.53a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 1.06-1.06L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditTarget(card)}
                      className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(card)}
                      className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CardFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        mode="create"
      />

      {editTarget && (
        <CardFormModal
          open
          onClose={() => setEditTarget(null)}
          mode="edit"
          card={editTarget}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Card"
        description={`Delete "${deleteTarget?.title || 'Untitled'}" from the carousel?`}
        loading={deleteCard.isPending}
      />
    </div>
  )
}

function CardFormModal({
  open,
  onClose,
  mode,
  card,
}: {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  card?: CarouselCardItem
}) {
  const toast = useToast()
  const createCard = useCreateCarouselCard()
  const updateCard = useUpdateCarouselCard()
  const uploadImage = useUploadImage()

  const [title, setTitle] = useState(card?.title ?? '')
  const [content, setContent] = useState(card?.content ?? '')
  const [imageUrl, setImageUrl] = useState(card?.image_url ?? '')

  const isPending =
    createCard.isPending || updateCard.isPending || uploadImage.isPending

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      uploadImage.mutate(base64, {
        onSuccess: (res) => {
          setImageUrl(res.url)
          toast.success('Image uploaded')
        },
        onError: (err) =>
          toast.error(getApiErrorMessage(err, 'Failed to upload image')),
      })
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const body = {
      title: title || undefined,
      content: content || undefined,
      image_url: imageUrl || undefined,
    }

    if (mode === 'create') {
      createCard.mutate(body, {
        onSuccess: () => {
          toast.success('Card created')
          onClose()
        },
        onError: (err) =>
          toast.error(getApiErrorMessage(err, 'Failed to create card')),
      })
    } else if (card) {
      updateCard.mutate(
        { cardId: String(card.id), body },
        {
          onSuccess: () => {
            toast.success('Card updated')
            onClose()
          },
          onError: (err) =>
            toast.error(getApiErrorMessage(err, 'Failed to update card')),
        },
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add Carousel Card' : 'Edit Carousel Card'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="card_title" className="block text-sm font-medium text-stone-700">
            Title
          </label>
          <input
            id="card_title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="card_content" className="block text-sm font-medium text-stone-700">
            Content
          </label>
          <textarea
            id="card_content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-stone-700">
            Image
          </label>
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="mb-2 h-32 w-auto rounded border border-stone-200 object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-stone-500 file:mr-3 file:rounded file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-sm file:text-stone-700 hover:file:bg-stone-200"
          />
          {uploadImage.isPending && (
            <p className="text-xs text-stone-500">Uploading...</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {isPending
              ? 'Saving...'
              : mode === 'create'
                ? 'Create'
                : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

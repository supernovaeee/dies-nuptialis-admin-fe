import { useState } from 'react'
import { useWishes } from '~/hooks/useWishes'
import { useModerateWish } from '~/hooks/useModerateWish'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { Pagination } from '~/components/ui/Pagination'
import { EmptyState } from '~/components/ui/EmptyState'
import { WishStatus } from '@api/model/enum/WishStatus'
import type { AdminWishItem } from '@api/schema/AdminWishItem'

const LIMIT = 50
const FILTERS = [
  { label: 'All', value: undefined },
  { label: 'Public', value: WishStatus.PUBLIC },
  { label: 'Private', value: WishStatus.PRIVATE },
] as const

export default function WishesPage() {
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  )
  const { data, isLoading, error } = useWishes(page, LIMIT, statusFilter)

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-medium text-stone-900">Wishes</h1>

      <div className="flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => {
              setStatusFilter(f.value)
              setPage(0)
            }}
            className={`rounded px-3 py-1.5 text-sm ${
              statusFilter === f.value
                ? 'bg-stone-900 font-medium text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load wishes.
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          title="No wishes found"
          description={
            statusFilter
              ? `No ${statusFilter.toLowerCase()} wishes.`
              : 'Wishes will appear here once guests submit them.'
          }
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-3">
            {data.data.map((wish) => (
              <WishCard key={wish.id} wish={wish} />
            ))}
          </div>

          <Pagination
            page={page}
            total={data.total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}

function WishCard({ wish }: { wish: AdminWishItem }) {
  const toast = useToast()
  const moderate = useModerateWish()

  const isPublic = wish.status === WishStatus.PUBLIC
  const targetStatus = isPublic ? WishStatus.PRIVATE : WishStatus.PUBLIC

  function handleToggle() {
    moderate.mutate(
      { wishId: String(wish.id), status: targetStatus },
      {
        onSuccess: () =>
          toast.success(`Wish set to ${targetStatus.toLowerCase()}`),
        onError: (err) =>
          toast.error(getApiErrorMessage(err, 'Failed to update wish')),
      },
    )
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-stone-900">
              {wish.guest_given_name || wish.fam_name}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                isPublic
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {wish.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-600 whitespace-pre-wrap">
            {wish.message_text}
          </p>
          {wish.image_url && (
            <img
              src={wish.image_url}
              alt=""
              className="mt-2 h-32 w-auto rounded border border-stone-200 object-cover"
            />
          )}
          <p className="mt-2 text-xs text-stone-400">
            {new Date(wish.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={moderate.isPending}
          className={`shrink-0 rounded px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
            isPublic
              ? 'border border-stone-300 text-stone-700 hover:bg-stone-50'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {moderate.isPending
            ? 'Updating...'
            : isPublic
              ? 'Make Private'
              : 'Make Public'}
        </button>
      </div>
    </div>
  )
}

import { useState, type FormEvent } from 'react'
import { useRsvpManagers } from '~/hooks/useRsvpManagers'
import { useCreateRsvpManager } from '~/hooks/useCreateRsvpManager'
import { useDeleteRsvpManager } from '~/hooks/useDeleteRsvpManager'
import { useDebounce } from '~/hooks/useDebounce'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { Modal } from '~/components/ui/Modal'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { EmptyState } from '~/components/ui/EmptyState'
import { Pagination } from '~/components/ui/Pagination'
import { ManagerInviteActionButtons } from '~/components/ManagerInviteActionButtons'
import type { AdminRsvpManagerItem } from '@api/schema/AdminRsvpManagerItem'

const LIMIT = 50

export default function RsvpManagersPage() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [page, setPage] = useState(0)
  const { data, isLoading, error } = useRsvpManagers(debouncedSearch || undefined, page, LIMIT)

  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminRsvpManagerItem | null>(null)
  const deleteManager = useDeleteRsvpManager()

  function handleDelete() {
    if (!deleteTarget) return
    deleteManager.mutate(String(deleteTarget.id), {
      onSuccess: () => {
        toast.success('RSVP manager deleted')
        setDeleteTarget(null)
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, 'Failed to delete RSVP manager'))
      },
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-stone-900">RSVP Managers</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Delegated viewers (e.g. parents) who can check RSVP status for the families tagged to them.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add Manager
        </button>
      </div>

      <input
        type="search"
        placeholder="Search managers..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(0)
        }}
        className="w-full max-w-sm rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
      />

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load RSVP managers.
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-stone-100" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          title="No RSVP managers yet"
          description="Add one to give a family member a read-only view of their tagged guests."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              Add Manager
            </button>
          }
        />
      )}

      {data && data.data.length > 0 && (
        <>
          {/* Mobile/tablet: card list */}
          <div className="space-y-3 md:hidden">
            {data.data.map((manager) => (
              <div key={manager.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-stone-900">{manager.name}</p>
                  <span className="shrink-0 text-xs text-stone-500">
                    {manager.family_count} {manager.family_count === 1 ? 'family' : 'families'}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-xs text-stone-500">{manager.passcode}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-stone-100 pt-3">
                  <ManagerInviteActionButtons manager={manager} />
                  <button
                    onClick={() => setDeleteTarget(manager)}
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto rounded-lg border border-stone-200 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Passcode</th>
                  <th className="px-4 py-3 font-medium text-stone-600 text-center">Families</th>
                  <th className="px-4 py-3 font-medium text-stone-600" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.data.map((manager) => (
                  <tr key={manager.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{manager.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">{manager.passcode}</td>
                    <td className="px-4 py-3 text-center text-stone-700">{manager.family_count}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <ManagerInviteActionButtons manager={manager} />
                        <span className="mx-1 h-4 w-px bg-stone-200" />
                        <button
                          onClick={() => setDeleteTarget(manager)}
                          className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} total={data.total} limit={LIMIT} onPageChange={setPage} />
        </>
      )}

      <CreateRsvpManagerModal open={showCreate} onClose={() => setShowCreate(false)} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete RSVP Manager"
        description={`This will delete "${deleteTarget?.name}" and untag them from any families (the families themselves are not affected). This action cannot be undone.`}
        loading={deleteManager.isPending}
      />
    </div>
  )
}

function CreateRsvpManagerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast()
  const createManager = useCreateRsvpManager()
  const [name, setName] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    createManager.mutate(
      { name },
      {
        onSuccess: () => {
          toast.success('RSVP manager created')
          setName('')
          onClose()
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to create RSVP manager'))
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Add RSVP Manager">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="manager_name" className="block text-sm font-medium text-stone-700">
            Name *
          </label>
          <input
            id="manager_name"
            type="text"
            required
            placeholder="e.g. Mother of the Bride"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
          />
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
            disabled={createManager.isPending}
            className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {createManager.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

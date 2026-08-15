import { useState, useMemo, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useFamilies } from '~/hooks/useFamilies'
import { useCreateFamily } from '~/hooks/useCreateFamily'
import { useDeleteFamily } from '~/hooks/useDeleteFamily'
import { useDebounce } from '~/hooks/useDebounce'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { ROUTES } from '~/constants'
import { Modal } from '~/components/ui/Modal'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { EmptyState } from '~/components/ui/EmptyState'
import type { AdminFamilyItem } from '@api/schema/AdminFamilyItem'

export default function FamiliesPage() {
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const showFilter = searchParams.get('show')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data, isLoading, error } = useFamilies(
    debouncedSearch || undefined,
    showFilter === 'vegetarian' ? 500 : 50,
  )

  const vegetarianGuests = useMemo(() => {
    if (showFilter !== 'vegetarian' || !data) return []
    return data.data.flatMap((family) =>
      family.guests
        .filter((g) => g.vegetarian)
        .map((g) => ({ guestName: g.name, familyName: family.fam_name, familyId: family.id })),
    )
  }, [data, showFilter])

  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminFamilyItem | null>(null)
  const deleteFamily = useDeleteFamily()

  function handleDelete() {
    if (!deleteTarget) return
    deleteFamily.mutate(String(deleteTarget.id), {
      onSuccess: () => {
        toast.success('Family deleted')
        setDeleteTarget(null)
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, 'Failed to delete family'))
      },
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-stone-900">Families</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add Family
        </button>
      </div>

      {showFilter === 'vegetarian' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500">Showing:</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              Vegetarian Guests
            </span>
            <button
              onClick={() => setSearchParams({})}
              className="rounded px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-700"
            >
              Clear
            </button>
          </div>

          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-stone-100" />
              ))}
            </div>
          )}

          {!isLoading && vegetarianGuests.length === 0 && (
            <EmptyState title="No vegetarian guests" description="No guests are marked as vegetarian." />
          )}

          {!isLoading && vegetarianGuests.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-stone-600">Guest Name</th>
                    <th className="px-4 py-3 font-medium text-stone-600">Family</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {vegetarianGuests.map((entry) => (
                    <tr key={`${entry.familyId}-${entry.guestName}`} className="hover:bg-stone-50">
                      <td className="px-4 py-3 text-stone-900">
                        <div className="flex items-center gap-2">
                          {entry.guestName}
                          <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                            Vegetarian
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={ROUTES.FAMILY_DETAIL(entry.familyId)}
                          className="text-stone-700 hover:underline"
                        >
                          {entry.familyName}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showFilter !== 'vegetarian' && (
        <input
          type="search"
          placeholder="Search families..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
        />
      )}

      {showFilter !== 'vegetarian' && error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load families.
        </div>
      )}

      {showFilter !== 'vegetarian' && isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-stone-100" />
          ))}
        </div>
      )}

      {showFilter !== 'vegetarian' && data && data.data.length === 0 && (
        <EmptyState
          title="No families yet"
          description="Add a family to get started."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              Add Family
            </button>
          }
        />
      )}

      {showFilter !== 'vegetarian' && data && data.data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-600">Family Name</th>
                <th className="px-4 py-3 font-medium text-stone-600">Invite Code</th>
                <th className="px-4 py-3 font-medium text-stone-600 text-center">Pax</th>
                <th className="px-4 py-3 font-medium text-stone-600 text-center">After Party</th>
                <th className="px-4 py-3 font-medium text-stone-600 text-center">Guests</th>
                <th className="px-4 py-3 font-medium text-stone-600 text-center">RSVP</th>
                <th className="px-4 py-3 font-medium text-stone-600 text-center">Letter</th>
                <th className="px-4 py-3 font-medium text-stone-600" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.data.map((family) => (
                <tr key={family.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <Link
                      to={ROUTES.FAMILY_DETAIL(family.id)}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {family.fam_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">
                    {family.invite_code}
                  </td>
                  <td className="px-4 py-3 text-center text-stone-700">
                    {family.pax_allowed}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge active={family.after_party_allowed} />
                  </td>
                  <td className="px-4 py-3 text-center text-stone-700">
                    {family.guests.length}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge active={family.has_rsvp} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge active={family.has_letter} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(family)}
                      className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateFamilyModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Family"
        description={`This will permanently delete "${deleteTarget?.fam_name}" and all associated guests, letters, and RSVPs. This action cannot be undone.`}
        loading={deleteFamily.isPending}
      />
    </div>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-stone-300'}`}
      title={active ? 'Yes' : 'No'}
    />
  )
}

function CreateFamilyModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const toast = useToast()
  const createFamily = useCreateFamily()
  const [famName, setFamName] = useState('')
  const [paxAllowed, setPaxAllowed] = useState(1)
  const [afterParty, setAfterParty] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    createFamily.mutate(
      {
        fam_name: famName,
        pax_allowed: paxAllowed,
        after_party_allowed: afterParty,
      },
      {
        onSuccess: () => {
          toast.success('Family created')
          setFamName('')
          setPaxAllowed(1)
          setAfterParty(false)
          onClose()
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to create family'))
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Family">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="fam_name" className="block text-sm font-medium text-stone-700">
            Family Name *
          </label>
          <input
            id="fam_name"
            type="text"
            required
            value={famName}
            onChange={(e) => setFamName(e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pax_allowed" className="block text-sm font-medium text-stone-700">
            Pax Allowed
          </label>
          <input
            id="pax_allowed"
            type="number"
            min={1}
            value={paxAllowed}
            onChange={(e) => setPaxAllowed(Number(e.target.value))}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="after_party"
            type="checkbox"
            checked={afterParty}
            onChange={(e) => setAfterParty(e.target.checked)}
            className="h-4 w-4 rounded border-stone-300"
          />
          <label htmlFor="after_party" className="text-sm text-stone-700">
            After party allowed
          </label>
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
            disabled={createFamily.isPending}
            className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {createFamily.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

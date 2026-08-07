import { useState, useMemo, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useFamilies } from '~/hooks/useFamilies'
import { useCreateFamily } from '~/hooks/useCreateFamily'
import { useDeleteFamily } from '~/hooks/useDeleteFamily'
import { useDebounce } from '~/hooks/useDebounce'
import { useRsvpManagers } from '~/hooks/useRsvpManagers'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { ROUTES } from '~/constants'
import { Modal } from '~/components/ui/Modal'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { EmptyState } from '~/components/ui/EmptyState'
import { Pagination } from '~/components/ui/Pagination'
import { InviteActionButtons } from '~/components/InviteActionButtons'
import { RsvpBadge } from '~/components/RsvpBadge'
import { RSVPStatus } from '@api/model/enum/RSVPStatus'
import type { AdminFamilyItem } from '@api/schema/AdminFamilyItem'

const LIMIT = 50
const UNASSIGNED_MANAGER = 'unassigned'
const FILTER_CONTROL_CLASS =
  'rounded border border-stone-300 px-2.5 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none'

export default function FamiliesPage() {
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const showFilter = searchParams.get('show')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [page, setPage] = useState(0)

  const managerFilter = searchParams.get('manager') ?? ''
  const statusFilter = searchParams.get('status') ?? ''
  const letterFilter = searchParams.get('letter') ?? ''
  const guestsMinFilter = searchParams.get('guests_min') ?? ''
  const guestsMaxFilter = searchParams.get('guests_max') ?? ''
  const hasActiveFilters = !!(managerFilter || statusFilter || letterFilter || guestsMinFilter || guestsMaxFilter)

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
    setPage(0)
  }

  function clearAllFilters() {
    const next = new URLSearchParams(searchParams)
    for (const key of ['manager', 'status', 'letter', 'guests_min', 'guests_max']) next.delete(key)
    setSearchParams(next)
    setPage(0)
  }

  const { data: managersData } = useRsvpManagers(undefined, 0, 200)

  const { data, isLoading, error } = useFamilies(
    {
      q: debouncedSearch || undefined,
      rsvpManagerId:
        managerFilter && managerFilter !== UNASSIGNED_MANAGER
          ? Number(managerFilter)
          : managerFilter === UNASSIGNED_MANAGER
            ? 0
            : undefined,
      rsvpStatus: statusFilter || undefined,
      hasLetter: letterFilter ? letterFilter === 'true' : undefined,
      guestsMin: guestsMinFilter !== '' ? Number(guestsMinFilter) : undefined,
      guestsMax: guestsMaxFilter !== '' ? Number(guestsMaxFilter) : undefined,
    },
    showFilter === 'vegetarian' ? 0 : page,
    showFilter === 'vegetarian' ? 500 : LIMIT,
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
        <div className="space-y-3">
          <input
            type="search"
            placeholder="Search families..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            className="w-full max-w-sm rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
          />

          <div className="flex flex-wrap items-end gap-3 rounded-lg border border-stone-200 bg-stone-50/60 p-3">
            <div className="space-y-1">
              <label htmlFor="filter-manager" className="block text-xs font-medium text-stone-500">
                RSVP Manager
              </label>
              <select
                id="filter-manager"
                value={managerFilter}
                onChange={(e) => setFilter('manager', e.target.value)}
                className={FILTER_CONTROL_CLASS}
              >
                <option value="">All managers</option>
                <option value={UNASSIGNED_MANAGER}>Unassigned</option>
                {managersData?.data.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="filter-status" className="block text-xs font-medium text-stone-500">
                RSVP Status
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setFilter('status', e.target.value)}
                className={FILTER_CONTROL_CLASS}
              >
                <option value="">All statuses</option>
                {Object.values(RSVPStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="filter-letter" className="block text-xs font-medium text-stone-500">
                Letter
              </label>
              <select
                id="filter-letter"
                value={letterFilter}
                onChange={(e) => setFilter('letter', e.target.value)}
                className={FILTER_CONTROL_CLASS}
              >
                <option value="">Any</option>
                <option value="true">Has letter</option>
                <option value="false">No letter</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="block text-xs font-medium text-stone-500">Guests</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Min"
                  value={guestsMinFilter}
                  onChange={(e) => setFilter('guests_min', e.target.value)}
                  className={`${FILTER_CONTROL_CLASS} w-20`}
                />
                <span className="text-stone-400">–</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Max"
                  value={guestsMaxFilter}
                  onChange={(e) => setFilter('guests_max', e.target.value)}
                  className={`${FILTER_CONTROL_CLASS} w-20`}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="rounded px-2 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
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

      {showFilter !== 'vegetarian' && data && data.data.length === 0 && (hasActiveFilters || debouncedSearch) && (
        <EmptyState
          title="No matching families"
          description="Try adjusting or clearing the search and filters."
          action={
            hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      )}

      {showFilter !== 'vegetarian' && data && data.data.length === 0 && !hasActiveFilters && !debouncedSearch && (
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
        <>
          {/* Mobile/tablet: card list */}
          <div className="space-y-3 lg:hidden">
            {data.data.map((family) => (
              <div key={family.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={ROUTES.FAMILY_DETAIL(family.id)}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {family.fam_name}
                    </Link>
                    <p className="mt-0.5 font-mono text-xs text-stone-500">{family.invite_code}</p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(family)}
                    className="shrink-0 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-y-2 text-xs sm:grid-cols-4">
                  <div>
                    <dt className="text-stone-500">Pax</dt>
                    <dd className="mt-0.5 text-stone-700">{family.pax_allowed}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Guests</dt>
                    <dd className="mt-0.5 text-stone-700">{family.guests.length}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">RSVP</dt>
                    <dd className="mt-0.5">
                      <RsvpBadge status={family.rsvp_status} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Letter</dt>
                    <dd className="mt-0.5">
                      <StatusBadge active={family.has_letter} />
                    </dd>
                  </div>
                </dl>

                <p className="mt-2 text-xs text-stone-500">
                  Manager: {family.rsvp_manager_name ?? <span className="text-stone-300">—</span>}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-stone-100 pt-3">
                  <InviteActionButtons family={family} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto rounded-lg border border-stone-200 lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Family Name</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Invite Code</th>
                  <th className="px-4 py-3 font-medium text-stone-600 text-center">Pax</th>
                  <th className="px-4 py-3 font-medium text-stone-600 text-center">Guests</th>
                  <th className="px-4 py-3 font-medium text-stone-600 text-center">RSVP</th>
                  <th className="px-4 py-3 font-medium text-stone-600 text-center">Letter</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Manager</th>
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
                    <td className="px-4 py-3 text-center text-stone-700">
                      {family.guests.length}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RsvpBadge status={family.rsvp_status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge active={family.has_letter} />
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {family.rsvp_manager_name ?? <span className="text-stone-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <InviteActionButtons family={family} />
                        <span className="mx-1 h-4 w-px bg-stone-200" />
                        <button
                          onClick={() => setDeleteTarget(family)}
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    createFamily.mutate(
      {
        fam_name: famName,
        pax_allowed: paxAllowed,
      },
      {
        onSuccess: () => {
          toast.success('Family created')
          setFamName('')
          setPaxAllowed(1)
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

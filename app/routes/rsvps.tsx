import { useState, useMemo, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useRsvps } from '~/hooks/useRsvps'
import { useRsvpSummary } from '~/hooks/useRsvpSummary'
import { useExportRsvp } from '~/hooks/useExportRsvp'
import { useUpdateRsvp } from '~/hooks/useUpdateRsvp'
import { useDeleteRsvp } from '~/hooks/useDeleteRsvp'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { ROUTES } from '~/constants'
import { Pagination } from '~/components/ui/Pagination'
import { EmptyState } from '~/components/ui/EmptyState'
import { Modal } from '~/components/ui/Modal'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { RSVPStatus } from '@api/model/enum/RSVPStatus'
import type { AdminRsvpItem } from '@api/schema/AdminRsvpItem'

const LIMIT = 50
const FILTERED_LIMIT = 1000

export default function RsvpsPage() {
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const mainFilter = searchParams.get('main')
  const afterPartyFilter = searchParams.get('after_party')
  const hasFilter = !!mainFilter || !!afterPartyFilter

  const [page, setPage] = useState(0)
  const { data: summary, isLoading: summaryLoading } = useRsvpSummary()
  const { data, isLoading, error } = useRsvps(page, hasFilter ? FILTERED_LIMIT : LIMIT)
  const exportRsvp = useExportRsvp()
  const updateRsvp = useUpdateRsvp()
  const deleteRsvp = useDeleteRsvp()

  const [editingRsvp, setEditingRsvp] = useState<AdminRsvpItem | null>(null)
  const [editMainStatus, setEditMainStatus] = useState<string>(RSVPStatus.PENDING)
  const [editAfterPartyStatus, setEditAfterPartyStatus] = useState<string>(RSVPStatus.PENDING)
  const [editNotes, setEditNotes] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<AdminRsvpItem | null>(null)

  const filteredData = useMemo(() => {
    if (!data) return null
    if (!hasFilter) return data
    const filtered = data.data.filter((rsvp) => {
      if (mainFilter && rsvp.attending_main_status !== mainFilter) return false
      if (afterPartyFilter && rsvp.attending_after_party !== afterPartyFilter) return false
      return true
    })
    return { total: filtered.length, data: filtered }
  }, [data, mainFilter, afterPartyFilter, hasFilter])

  function clearFilter() {
    setSearchParams({})
    setPage(0)
  }

  function openEdit(rsvp: AdminRsvpItem) {
    setEditingRsvp(rsvp)
    setEditMainStatus(rsvp.attending_main_status)
    setEditAfterPartyStatus(rsvp.attending_after_party)
    setEditNotes(rsvp.special_notes ?? '')
    setEditEmail(rsvp.email ?? '')
  }

  function handleUpdateRsvp(e: FormEvent) {
    e.preventDefault()
    if (!editingRsvp) return
    updateRsvp.mutate(
      {
        rsvpId: String(editingRsvp.id),
        body: {
          attending_main_status: editMainStatus,
          attending_after_party: editAfterPartyStatus,
          special_notes: editNotes,
          email: editEmail,
        },
      },
      {
        onSuccess: () => {
          toast.success('RSVP updated')
          setEditingRsvp(null)
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to update RSVP'))
        },
      },
    )
  }

  function handleDeleteRsvp() {
    if (!deleteTarget) return
    deleteRsvp.mutate(String(deleteTarget.id), {
      onSuccess: () => {
        toast.success('RSVP deleted')
        setDeleteTarget(null)
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, 'Failed to delete RSVP'))
      },
    })
  }

  function handleExport() {
    exportRsvp.mutate(undefined, {
      onSuccess: () => toast.success('CSV downloaded'),
      onError: (err) =>
        toast.error(getApiErrorMessage(err, 'Failed to export')),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-stone-900">RSVPs</h1>
        <button
          onClick={handleExport}
          disabled={exportRsvp.isPending}
          className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          {exportRsvp.isPending ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <SummaryStat
          label="Total"
          families={summary?.total_families}
          members={summary?.total_family_members}
          loading={summaryLoading}
        />
        <SummaryStat
          label="Submitted"
          families={summary?.total_rsvp_submitted}
          loading={summaryLoading}
          familiesLabel="responses"
        />
        <SummaryStat
          label="Attending"
          families={summary?.attending_families}
          members={summary?.attending_members}
          loading={summaryLoading}
          color="emerald"
        />
        <SummaryStat
          label="Declined"
          families={summary?.declined_families}
          members={summary?.declined_members}
          loading={summaryLoading}
          color="red"
        />
        <SummaryStat
          label="Pending"
          families={summary?.pending_families}
          members={summary?.pending_members}
          loading={summaryLoading}
          color="amber"
        />
        <SummaryStat
          label="Vegetarian"
          families={summary?.vegetarian_count}
          loading={summaryLoading}
          familiesLabel="people"
        />
      </div>

      {hasFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">Filtering by:</span>
          {mainFilter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
              Main: {mainFilter}
            </span>
          )}
          {afterPartyFilter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
              After Party: {afterPartyFilter}
            </span>
          )}
          <button
            onClick={clearFilter}
            className="rounded px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-700"
          >
            Clear
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load RSVPs.
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-stone-100" />
          ))}
        </div>
      )}

      {filteredData && filteredData.data.length === 0 && (
        <EmptyState
          title={hasFilter ? 'No matching RSVPs' : 'No RSVPs yet'}
          description={hasFilter ? 'Try clearing the filter.' : 'RSVPs will appear here once guests respond.'}
        />
      )}

      {filteredData && filteredData.data.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-stone-200">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Family</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Main</th>
                  <th className="px-4 py-3 font-medium text-stone-600">After Party</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Notes</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Email</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Date</th>
                  <th className="px-4 py-3 font-medium text-stone-600" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredData.data.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <Link
                        to={ROUTES.FAMILY_DETAIL(rsvp.family_id)}
                        className="font-medium text-stone-900 hover:underline"
                      >
                        {rsvp.fam_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <RsvpBadge status={rsvp.attending_main_status} />
                    </td>
                    <td className="px-4 py-3">
                      <RsvpBadge status={rsvp.attending_after_party} />
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-stone-600">
                      {rsvp.special_notes || '–'}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {rsvp.email || '–'}
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">
                      {new Date(rsvp.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(rsvp)}
                          className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(rsvp)}
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

          {!hasFilter && (
            <Pagination
              page={page}
              total={data!.total}
              limit={LIMIT}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <Modal
        open={!!editingRsvp}
        onClose={() => setEditingRsvp(null)}
        title="Edit RSVP"
      >
        <form onSubmit={handleUpdateRsvp} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="edit_main_status" className="block text-sm font-medium text-stone-700">
              Main Event
            </label>
            <select
              id="edit_main_status"
              value={editMainStatus}
              onChange={(e) => setEditMainStatus(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            >
              {Object.values(RSVPStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="edit_after_party_status" className="block text-sm font-medium text-stone-700">
              After Party
            </label>
            <select
              id="edit_after_party_status"
              value={editAfterPartyStatus}
              onChange={(e) => setEditAfterPartyStatus(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            >
              {Object.values(RSVPStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="edit_email" className="block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="edit_email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="edit_notes" className="block text-sm font-medium text-stone-700">
              Notes
            </label>
            <textarea
              id="edit_notes"
              rows={3}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingRsvp(null)}
              className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateRsvp.isPending}
              className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {updateRsvp.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteRsvp}
        title="Delete RSVP"
        description={`Delete the RSVP submitted by "${deleteTarget?.fam_name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteRsvp.isPending}
      />
    </div>
  )
}

function RsvpBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ATTENDING: 'bg-emerald-100 text-emerald-700',
    DECLINED: 'bg-red-100 text-red-700',
    PENDING: 'bg-amber-100 text-amber-700',
  }

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-stone-100 text-stone-600'}`}
    >
      {status}
    </span>
  )
}

interface SummaryStatProps {
  label: string
  families: number | undefined
  members?: number | undefined
  loading: boolean
  color?: 'emerald' | 'red' | 'amber'
  familiesLabel?: string
}

function SummaryStat({
  label,
  families,
  members,
  loading,
  color,
  familiesLabel = 'families',
}: SummaryStatProps) {
  const textColor =
    color === 'emerald'
      ? 'text-emerald-700'
      : color === 'red'
        ? 'text-red-700'
        : color === 'amber'
          ? 'text-amber-700'
          : 'text-stone-900'

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2">
      <p className="text-xs text-stone-500">{label}</p>
      {loading ? (
        <div className="mt-1 space-y-1">
          <div className="h-5 w-16 animate-pulse rounded bg-stone-100" />
          {members !== undefined && (
            <div className="h-4 w-14 animate-pulse rounded bg-stone-100" />
          )}
        </div>
      ) : (
        <div className="mt-0.5">
          <p className={`text-lg font-semibold ${textColor}`}>
            {families ?? '–'}{' '}
            <span className="text-xs font-normal text-stone-400">{familiesLabel}</span>
          </p>
          {members !== undefined && (
            <p className={`text-lg font-semibold ${textColor}`}>
              {members ?? '–'}{' '}
              <span className="text-xs font-normal text-stone-400">members</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

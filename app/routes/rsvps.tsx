import { useState } from 'react'
import { useRsvps } from '~/hooks/useRsvps'
import { useRsvpSummary } from '~/hooks/useRsvpSummary'
import { useExportRsvp } from '~/hooks/useExportRsvp'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { Pagination } from '~/components/ui/Pagination'
import { EmptyState } from '~/components/ui/EmptyState'

const LIMIT = 50

export default function RsvpsPage() {
  const toast = useToast()
  const [page, setPage] = useState(0)
  const { data: summary, isLoading: summaryLoading } = useRsvpSummary()
  const { data, isLoading, error } = useRsvps(page, LIMIT)
  const exportRsvp = useExportRsvp()

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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Submitted" value={summary?.total_rsvp_submitted} loading={summaryLoading} />
        <MiniStat label="Attending" value={summary?.attending_main} loading={summaryLoading} color="emerald" />
        <MiniStat label="Declined" value={summary?.declined_main} loading={summaryLoading} color="red" />
        <MiniStat label="Pending" value={summary?.pending_main} loading={summaryLoading} color="amber" />
      </div>

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

      {data && data.data.length === 0 && (
        <EmptyState title="No RSVPs yet" description="RSVPs will appear here once guests respond." />
      )}

      {data && data.data.length > 0 && (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.data.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {rsvp.fam_name}
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
                  </tr>
                ))}
              </tbody>
            </table>
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

function MiniStat({
  label,
  value,
  loading,
  color,
}: {
  label: string
  value: number | undefined
  loading: boolean
  color?: 'emerald' | 'red' | 'amber'
}) {
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
        <div className="mt-1 h-6 w-8 animate-pulse rounded bg-stone-100" />
      ) : (
        <p className={`mt-0.5 text-xl font-semibold ${textColor}`}>
          {value ?? '–'}
        </p>
      )}
    </div>
  )
}

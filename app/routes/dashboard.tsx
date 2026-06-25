import { Link } from 'react-router'
import { useRsvpSummary } from '~/hooks/useRsvpSummary'
import { ROUTES } from '~/constants'

export default function DashboardPage() {
  const { data, isLoading, error } = useRsvpSummary()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-medium text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Wedding admin overview
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load summary data.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <SummaryCard
          label="Total Families"
          value={data?.total_families}
          loading={isLoading}
        />
        <SummaryCard
          label="RSVPs Submitted"
          value={data?.total_rsvp_submitted}
          loading={isLoading}
        />
        <SummaryCard
          label="Attending (Main)"
          value={data?.attending_main}
          loading={isLoading}
          color="emerald"
        />
        <SummaryCard
          label="Declined (Main)"
          value={data?.declined_main}
          loading={isLoading}
          color="red"
        />
        <SummaryCard
          label="Pending (Main)"
          value={data?.pending_main}
          loading={isLoading}
          color="amber"
        />
        <SummaryCard
          label="Attending (After Party)"
          value={data?.attending_after_party}
          loading={isLoading}
          color="emerald"
        />
        <SummaryCard
          label="Declined (After Party)"
          value={data?.declined_after_party}
          loading={isLoading}
          color="red"
        />
        <SummaryCard
          label="Pending (After Party)"
          value={data?.pending_after_party}
          loading={isLoading}
          color="amber"
        />
        <SummaryCard
          label="Vegetarian"
          value={data?.vegetarian_count}
          loading={isLoading}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-stone-700">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <QuickLink to={ROUTES.FAMILIES} label="Manage Families" />
          <QuickLink to={ROUTES.RSVPS} label="View RSVPs" />
          <QuickLink to={ROUTES.WISHES} label="Moderate Wishes" />
          <QuickLink to={ROUTES.CAROUSEL} label="Edit Carousel" />
        </div>
      </div>
    </div>
  )
}

interface SummaryCardProps {
  label: string
  value: number | undefined
  loading: boolean
  color?: 'emerald' | 'red' | 'amber'
}

function SummaryCard({ label, value, loading, color }: SummaryCardProps) {
  const valueColor =
    color === 'emerald'
      ? 'text-emerald-700'
      : color === 'red'
        ? 'text-red-700'
        : color === 'amber'
          ? 'text-amber-700'
          : 'text-stone-900'

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-3">
      <p className="text-xs text-stone-500">{label}</p>
      {loading ? (
        <div className="mt-1 h-7 w-12 animate-pulse rounded bg-stone-100" />
      ) : (
        <p className={`mt-1 text-2xl font-semibold ${valueColor}`}>
          {value ?? '–'}
        </p>
      )}
    </div>
  )
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
    >
      {label}
    </Link>
  )
}

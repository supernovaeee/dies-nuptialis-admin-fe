import { useState } from 'react'
import { useManagerFamilies } from '~/hooks/useManagerFamilies'
import { useUpdateManagerMessage } from '~/hooks/useUpdateManagerMessage'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { EmptyState } from '~/components/ui/EmptyState'
import { Pagination } from '~/components/ui/Pagination'
import { InviteActionButtons } from '~/components/InviteActionButtons'
import { MessageTemplateCard } from '~/components/MessageTemplateCard'
import { RsvpBadge } from '~/components/RsvpBadge'
import { RSVPStatus } from '@api/model/enum/RSVPStatus'
import type { ManagerFamilyItem } from '@api/schema/ManagerFamilyItem'

const LIMIT = 20

export default function ManagerDashboardPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, error } = useManagerFamilies(page, LIMIT)
  const toast = useToast()
  const updateMessage = useUpdateManagerMessage()

  function handleSaveMessage(message: string) {
    updateMessage.mutate(message, {
      onSuccess: () => toast.success('Message template saved'),
      onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to save message template')),
    })
  }

  return (
    <div className="space-y-5">
      {data && (
        <p className="text-sm text-stone-500">
          Guests tagged to <span className="font-medium text-stone-700">{data.manager_name}</span>
        </p>
      )}

      {isLoading && <GuestSummarySkeleton />}
      {data && data.attending_families + data.declined_families + data.pending_families > 0 && (
        <GuestSummary
          invitedFamilies={data.attending_families + data.declined_families + data.pending_families}
          invitedGuests={data.attending_guests + data.declined_guests + data.pending_guests}
          attendingFamilies={data.attending_families}
          attendingGuests={data.attending_guests}
          declinedFamilies={data.declined_families}
          declinedGuests={data.declined_guests}
        />
      )}

      {data && (
        <MessageTemplateCard
          message={data.manager_message}
          isSaving={updateMessage.isPending}
          onSave={handleSaveMessage}
          description={'Used by the "Copy Message" button for every guest below.'}
        />
      )}

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load your guests.
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-stone-100" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          title="No guests tagged to you yet"
          description="Ask the wedding admin to tag a family under your name."
        />
      )}

      {data && data.data.length > 0 && (
        <>
          {/* Mobile: card list */}
          <div className="space-y-3 sm:hidden">
            {data.data.map((family) => (
              <div key={family.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-stone-900">{family.fam_name}</p>
                  <FamilyRsvpBadge family={family} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-stone-100 pt-3">
                  <InviteActionButtons family={family} template={data.manager_message} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto rounded-lg border border-stone-200 bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Family</th>
                  <th className="px-4 py-3 font-medium text-stone-600">RSVP</th>
                  <th className="px-4 py-3 font-medium text-stone-600" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.data.map((family) => (
                  <tr key={family.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{family.fam_name}</td>
                    <td className="px-4 py-3">
                      <FamilyRsvpBadge family={family} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <InviteActionButtons family={family} template={data.manager_message} />
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
    </div>
  )
}

function FamilyRsvpBadge({ family }: { family: ManagerFamilyItem }) {
  if (family.rsvp_status !== RSVPStatus.PENDING) {
    return <RsvpBadge status={family.rsvp_status} />
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <RsvpBadge status={RSVPStatus.PENDING} />
      {family.attending_main_status_marker && (
        <span className="text-[11px] text-stone-400">
          Marked {family.attending_main_status_marker.toLowerCase()} by admin
        </span>
      )}
    </div>
  )
}

interface GuestSummaryProps {
  invitedFamilies: number
  invitedGuests: number
  attendingFamilies: number
  attendingGuests: number
  declinedFamilies: number
  declinedGuests: number
}

function GuestSummary({
  invitedFamilies,
  invitedGuests,
  attendingFamilies,
  attendingGuests,
  declinedFamilies,
  declinedGuests,
}: GuestSummaryProps) {
  const responded = attendingFamilies + declinedFamilies
  const attendingPct = invitedFamilies > 0 ? (attendingFamilies / invitedFamilies) * 100 : 0
  const declinedPct = invitedFamilies > 0 ? (declinedFamilies / invitedFamilies) * 100 : 0

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
      <div className="grid grid-cols-3 divide-x divide-stone-100">
        <SummaryStat
          label="Invited"
          value={invitedFamilies}
          subValue={`${invitedGuests} guests`}
          dotClassName="bg-stone-400"
          valueClassName="text-stone-900"
        />
        <SummaryStat
          label="Attending"
          value={attendingFamilies}
          subValue={`${attendingGuests} guests`}
          dotClassName="bg-emerald-500"
          valueClassName="text-emerald-700"
        />
        <SummaryStat
          label="Declined"
          value={declinedFamilies}
          subValue={`${declinedGuests} guests`}
          dotClassName="bg-red-500"
          valueClassName="text-red-700"
        />
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Responses received</span>
          <span className="font-medium text-stone-700">
            {responded} / {invitedFamilies} families
          </span>
        </div>
        <div
          className="flex h-1.5 w-full overflow-hidden rounded-full bg-stone-100"
          role="img"
          aria-label={`${attendingFamilies} families attending, ${declinedFamilies} families declined, out of ${invitedFamilies} invited`}
        >
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${attendingPct}%` }} />
          <div className="h-full bg-red-400 transition-all" style={{ width: `${declinedPct}%` }} />
        </div>
      </div>
    </div>
  )
}

interface SummaryStatProps {
  label: string
  value: number
  subValue: string
  dotClassName: string
  valueClassName: string
}

function SummaryStat({ label, value, subValue, dotClassName, valueClassName }: SummaryStatProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-center first:pl-0 last:pr-0">
      <span className="flex items-center gap-1.5 text-xs text-stone-500">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClassName}`} />
        {label}
      </span>
      <span className={`text-2xl font-semibold tabular-nums ${valueClassName}`}>{value}</span>
      <span className="text-[11px] text-stone-400">{subValue}</span>
    </div>
  )
}

function GuestSummarySkeleton() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5" aria-busy="true">
      <div className="grid grid-cols-3 divide-x divide-stone-100">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 px-2">
            <div className="h-3 w-14 animate-pulse rounded bg-stone-100" />
            <div className="h-7 w-8 animate-pulse rounded bg-stone-100" />
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="h-3 w-full animate-pulse rounded bg-stone-100" />
        <div className="h-1.5 w-full animate-pulse rounded-full bg-stone-100" />
      </div>
    </div>
  )
}


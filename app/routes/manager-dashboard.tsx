import { useEffect, useMemo, useState } from 'react'
import { useManagerFamilies } from '~/hooks/useManagerFamilies'
import { useUpdateManagerMessage } from '~/hooks/useUpdateManagerMessage'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { EmptyState } from '~/components/ui/EmptyState'
import { InviteActionButtons } from '~/components/InviteActionButtons'
import { RsvpBadge } from '~/components/RsvpBadge'
import { RSVPStatus } from '@api/model/enum/RSVPStatus'

export default function ManagerDashboardPage() {
  const { data, isLoading, error } = useManagerFamilies()

  const summary = useMemo(() => {
    const families = data?.data ?? []
    return {
      invited: families.length,
      attending: families.filter((f) => f.rsvp_status === RSVPStatus.ATTENDING).length,
      declined: families.filter((f) => f.rsvp_status === RSVPStatus.DECLINED).length,
    }
  }, [data])

  return (
    <div className="space-y-5">
      {data && (
        <p className="text-sm text-stone-500">
          Guests tagged to <span className="font-medium text-stone-700">{data.manager_name}</span>
        </p>
      )}

      {isLoading && <GuestSummarySkeleton />}
      {data && data.data.length > 0 && (
        <GuestSummary invited={summary.invited} attending={summary.attending} declined={summary.declined} />
      )}

      {data && <MessageTemplateCard managerMessage={data.manager_message} />}

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
                  <RsvpBadge status={family.rsvp_status} />
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
                      <RsvpBadge status={family.rsvp_status} />
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
        </>
      )}
    </div>
  )
}

interface GuestSummaryProps {
  invited: number
  attending: number
  declined: number
}

function GuestSummary({ invited, attending, declined }: GuestSummaryProps) {
  const responded = attending + declined
  const attendingPct = invited > 0 ? (attending / invited) * 100 : 0
  const declinedPct = invited > 0 ? (declined / invited) * 100 : 0

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
      <div className="grid grid-cols-3 divide-x divide-stone-100">
        <SummaryStat label="Invited" value={invited} dotClassName="bg-stone-400" valueClassName="text-stone-900" />
        <SummaryStat
          label="Attending"
          value={attending}
          dotClassName="bg-emerald-500"
          valueClassName="text-emerald-700"
        />
        <SummaryStat label="Declined" value={declined} dotClassName="bg-red-500" valueClassName="text-red-700" />
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Responses received</span>
          <span className="font-medium text-stone-700">
            {responded} / {invited}
          </span>
        </div>
        <div
          className="flex h-1.5 w-full overflow-hidden rounded-full bg-stone-100"
          role="img"
          aria-label={`${attending} attending, ${declined} declined, out of ${invited} invited`}
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
  dotClassName: string
  valueClassName: string
}

function SummaryStat({ label, value, dotClassName, valueClassName }: SummaryStatProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-center first:pl-0 last:pr-0">
      <span className="flex items-center gap-1.5 text-xs text-stone-500">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClassName}`} />
        {label}
      </span>
      <span className={`text-2xl font-semibold tabular-nums ${valueClassName}`}>{value}</span>
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

function MessageTemplateCard({ managerMessage }: { managerMessage?: string }) {
  const toast = useToast()
  const updateMessage = useUpdateManagerMessage()
  const [message, setMessage] = useState(managerMessage ?? '')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setMessage(managerMessage ?? '')
    setDirty(false)
  }, [managerMessage])

  function handleSave() {
    updateMessage.mutate(message, {
      onSuccess: () => {
        toast.success('Message template saved')
        setDirty(false)
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, 'Failed to save message template'))
      },
    })
  }

  return (
    <div className="space-y-2 rounded-lg border border-stone-200 bg-white p-4">
      <label htmlFor="message_template" className="block text-sm font-medium text-stone-700">
        Message Template
      </label>
      <textarea
        id="message_template"
        rows={5}
        placeholder={"Dear {{name}},\n\nYou're invited to our wedding! Please RSVP here:\n\n{{link}}"}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          setDirty(true)
        }}
        className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
      />
      <p className="text-xs text-stone-500">
        Used by the "Copy Message" button for every guest below. Leave blank to use the default message. Use{' '}
        <code className="rounded bg-stone-100 px-1">{'{{name}}'}</code> and{' '}
        <code className="rounded bg-stone-100 px-1">{'{{link}}'}</code> as placeholders — they'll be filled in per guest.
      </p>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={updateMessage.isPending || !dirty}
          className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {updateMessage.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

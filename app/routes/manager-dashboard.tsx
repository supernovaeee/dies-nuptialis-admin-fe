import { useManagerFamilies } from '~/hooks/useManagerFamilies'
import { EmptyState } from '~/components/ui/EmptyState'
import { InviteActionButtons } from '~/components/InviteActionButtons'
import { RsvpBadge } from '~/components/RsvpBadge'

export default function ManagerDashboardPage() {
  const { data, isLoading, error } = useManagerFamilies()

  return (
    <div className="space-y-5">
      {data && (
        <p className="text-sm text-stone-500">
          Guests tagged to <span className="font-medium text-stone-700">{data.manager_name}</span>
        </p>
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
                  <RsvpBadge status={family.rsvp_status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-stone-100 pt-3">
                  <InviteActionButtons family={family} />
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
                        <InviteActionButtons family={family} />
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

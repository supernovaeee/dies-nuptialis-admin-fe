import { useUpdateFamily } from '~/hooks/useUpdateFamily'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { RSVPStatus } from '@api/model/enum/RSVPStatus'
import type { AdminFamilyItem } from '@api/schema/AdminFamilyItem'

const OPTIONS: { value: string; label: string; activeClass: string }[] = [
  { value: '', label: 'Not set', activeClass: 'bg-stone-600 text-white' },
  { value: RSVPStatus.ATTENDING, label: 'Attending', activeClass: 'bg-emerald-600 text-white' },
  { value: RSVPStatus.DECLINED, label: 'Declined', activeClass: 'bg-red-600 text-white' },
]

const SUCCESS_MESSAGE: Record<string, string> = {
  '': 'Attendance marker cleared',
  [RSVPStatus.ATTENDING]: 'Marked as Attending',
  [RSVPStatus.DECLINED]: 'Marked as Declined',
}

export function AttendanceCell({ family }: { family: AdminFamilyItem }) {
  const toast = useToast()
  const updateFamily = useUpdateFamily()
  const current = family.attending_main_status_marker ?? ''

  if (family.has_rsvp) {
    return (
      <span className="text-stone-300" title="RSVP submitted — no marker needed">
        —
      </span>
    )
  }

  function setMarker(value: string) {
    if (value === current) return
    updateFamily.mutate(
      { familyId: String(family.id), body: { attending_main_status_marker: value } },
      {
        onSuccess: () => toast.success(SUCCESS_MESSAGE[value]),
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update attendance')),
      },
    )
  }

  return (
    <div
      role="group"
      aria-label={`Attendance marker for ${family.fam_name}`}
      className="inline-flex overflow-hidden rounded-full border border-stone-300"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === current
        const isPending = updateFamily.isPending && updateFamily.variables?.body.attending_main_status_marker === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            aria-label={`Mark as ${option.label}`}
            disabled={updateFamily.isPending}
            onClick={() => setMarker(option.value)}
            className={`px-2 py-1 text-xs font-medium transition-colors focus:z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-500 disabled:cursor-not-allowed ${
              isActive ? option.activeClass : 'bg-white text-stone-500 hover:bg-stone-50'
            }`}
          >
            {isPending ? '…' : option.label}
          </button>
        )
      })}
    </div>
  )
}

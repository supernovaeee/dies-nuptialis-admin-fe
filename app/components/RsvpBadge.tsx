export function RsvpBadge({ status }: { status: string }) {
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
